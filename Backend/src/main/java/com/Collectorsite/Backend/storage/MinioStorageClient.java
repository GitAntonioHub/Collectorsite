package com.Collectorsite.Backend.storage;

import io.minio.*;
import io.minio.http.Method;
import jakarta.annotation.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@Primary                // preferred bean if several are present
@Profile("!dev")        // gets skipped in the "dev" spring profile
public class MinioStorageClient implements ObjectStorage {

    // ---------------------------------------------------------------- config
    @Value("${storage.endpoint:http://localhost:9000}")
    private String endpoint;

    @Value("${storage.accessKey:minioadmin}")
    private String accessKey;

    @Value("${storage.secretKey:minioadmin}")
    private String secretKey;

    @Value("${storage.bucket:items}")
    private String bucket;

    // ---------------------------------------------------------------- impl
    private MinioClient minio;

    @PostConstruct
    void init() {
        this.minio = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
        try {
            boolean exists = minio.bucketExists(
                    BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minio.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Unable to prepare MinIO bucket", e);
        }
    }

    @Override
    public void upload(String objectName,
                       InputStream data,
                       long size,
                       String contentType) {

        try {
            minio.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .stream(data, size, -1)
                            .contentType(contentType)
                            .build());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<InputStream> download(String objectName) {
        try {
            return Optional.of(
                    minio.getObject(GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(String objectName) {
        try {
            minio.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String put(String folder, MultipartFile file) {
        try {
            String objectName = folder + "/" + UUID.randomUUID() +
                    "-" + file.getOriginalFilename();

            upload(objectName,
                    file.getInputStream(),
                    file.getSize(),
                    file.getContentType());

            return minio.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .method(Method.GET)
                            .expiry(7 * 24 * 3600)   // 7 days
                            .build());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
