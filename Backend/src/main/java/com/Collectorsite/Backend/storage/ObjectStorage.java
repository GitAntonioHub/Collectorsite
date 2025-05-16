package com.Collectorsite.Backend.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Optional;

/**
 * Minimal abstraction around whatever object-store you use.
 */
public interface ObjectStorage {

    /** Raw upload (used for large files, streams, etc.) */
    void upload(String objectName,
                InputStream data,
                long size,
                String contentType);

    /** Download the object or return {@link Optional#empty()} if it is missing. */
    Optional<InputStream> download(String objectName);

    /** Permanently delete the object. */
    void delete(String objectName);

    /**
     * Convenience helper – uploads a {@link MultipartFile} into a <code>folder/…</code>
     * and returns a 7-day presigned URL.
     */
    String put(String folder, MultipartFile file);
}
