package com.Collectorsite.Backend.component;

import io.minio.BucketExistsArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
        import io.minio.*;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.web.multipart.MultipartFile;

@Component
public class StorageClient {

    private final MinioClient client;
    private final String bucket;

    public StorageClient(@Value("${storage.endpoint}") String endpoint,
                         @Value("${storage.accessKey}") String access,
                         @Value("${storage.secretKey}") String secret,
                         @Value("${storage.bucket}")    String bucket) {
        this.bucket = bucket;
        this.client = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(access, secret)
                .build();
        try {
            if (!client.bucketExists(
                    BucketExistsArgs.builder().bucket(bucket).build())) {
                client.makeBucket(
                        MakeBucketArgs.builder().bucket(bucket).build());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /** Uploads a file and returns a 7‑day presigned URL */
    public String put(String folder, MultipartFile file) {
        try {
            String object = folder + "/" +
                    java.util.UUID.randomUUID() + "-" + file.getOriginalFilename();
            client.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(object)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());
            return client.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucket)
                            .object(object)
                            .expiry(7 * 24 * 3600) // 7 days
                            .build());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
