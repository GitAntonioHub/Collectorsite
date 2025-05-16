package com.Collectorsite.Backend.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@Profile("dev")                     // active only in the dev profile
public class FilesystemStorageClient implements ObjectStorage {

    private static final Path ROOT = Paths.get("tmp-uploads");

    public FilesystemStorageClient() throws IOException {
        Files.createDirectories(ROOT);
    }

    @Override
    public void upload(String objectName,
                       InputStream data,
                       long size,
                       String contentType) {

        Path target = ROOT.resolve(objectName);
        try {
            Files.createDirectories(target.getParent());
            Files.copy(data, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    @Override
    public Optional<InputStream> download(String objectName) {
        Path p = ROOT.resolve(objectName);
        if (Files.exists(p)) {
            try {
                return Optional.of(Files.newInputStream(p));
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        }
        return Optional.empty();
    }

    @Override
    public void delete(String objectName) {
        try {
            Files.deleteIfExists(ROOT.resolve(objectName));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    @Override
    public String put(String folder, MultipartFile file) {
        String objectName = folder + "/" + UUID.randomUUID() +
                "-" + file.getOriginalFilename();
        try (InputStream in = file.getInputStream()) {
            upload(objectName, in, file.getSize(), file.getContentType());
            return "/local/" + objectName.replace('\\', '/'); // dev placeholder URL
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
