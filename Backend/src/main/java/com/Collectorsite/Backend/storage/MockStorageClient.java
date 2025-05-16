package com.Collectorsite.Backend.storage;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Optional;

@Component
@ConditionalOnProperty(name = "storage.enabled", havingValue = "false")
public class MockStorageClient implements ObjectStorage {

    @Override
    public void upload(String objectName, InputStream data, long size, String contentType) {
        // Do nothing
    }

    @Override
    public Optional<InputStream> download(String objectName) {
        return Optional.empty();
    }

    @Override
    public void delete(String objectName) {
        // Do nothing
    }

    @Override
    public String put(String folder, MultipartFile file) {
        return "mock-url";
    }
} 