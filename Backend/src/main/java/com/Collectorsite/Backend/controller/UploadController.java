package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.component.StorageClient;
import com.Collectorsite.Backend.entity.CollectorItem;
import com.Collectorsite.Backend.entity.ItemDocument;
import com.Collectorsite.Backend.entity.ItemImage;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

    private final StorageClient storage;

    @PostMapping("/item-image/{itemId}")
    public ItemImage uploadImage(@PathVariable UUID itemId,
                                 @RequestPart MultipartFile file,
                                 Principal principal) {
        // TODO: verify ownership before saving
        String url = storage.put("images", file);
        return ItemImage.builder()
                .item(CollectorItem.builder().id(itemId).build())
                .url(url)
                .isPrimary(false)
                .build();
    }

    @PostMapping("/item-doc/{itemId}")
    public ItemDocument uploadDoc(@PathVariable UUID itemId,
                                  @RequestPart MultipartFile file,
                                  Principal principal) {
        String url = storage.put("docs", file);
        return ItemDocument.builder()
                .item(CollectorItem.builder().id(itemId).build())
                .type(file.getContentType())
                .filePath(url)
                .build();
    }
}

