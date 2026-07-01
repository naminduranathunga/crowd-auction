package com.crowd.auction.itemservice.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface ObjectStorageService {
    String upload(String objectKey, MultipartFile file);

    void delete(String objectKey);
}
