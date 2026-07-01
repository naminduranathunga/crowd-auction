package com.crowd.auction.itemservice.service.storage;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.SetBucketPolicyArgs;
import lombok.RequiredArgsConstructor;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class MinioObjectStorageService implements ObjectStorageService {

    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    @PostConstruct
    public void initializeBucket() {
        ensureBucketExists();
        ensurePublicReadPolicy();
    }

    @Override
    public String upload(String objectKey, MultipartFile file) {
        ensureBucketExists();
        ensurePublicReadPolicy();

        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(minioProperties.getBucket())
                    .object(objectKey)
                    .stream(inputStream, file.getSize(), -1)
                    .contentType(file.getContentType() == null ? "application/octet-stream" : file.getContentType())
                    .build());
        } catch (Exception exception) {
            throw new RuntimeException("Failed to upload file to object storage", exception);
        }

        return trimTrailingSlash(minioProperties.getPublicUrl()) + "/" + minioProperties.getBucket() + "/" + objectKey;
    }

    @Override
    public void delete(String objectKey) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(minioProperties.getBucket())
                    .object(objectKey)
                    .build());
        } catch (Exception exception) {
            throw new RuntimeException("Failed to delete file from object storage", exception);
        }
    }

    private void ensureBucketExists() {
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder()
                    .bucket(minioProperties.getBucket())
                    .build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder()
                        .bucket(minioProperties.getBucket())
                        .build());
            }
        } catch (Exception exception) {
            throw new RuntimeException("Failed to verify object storage bucket", exception);
        }
    }

        private void ensurePublicReadPolicy() {
                String bucket = minioProperties.getBucket();
                String policyJson = """
                                {
                                    "Version": "2012-10-17",
                                    "Statement": [
                                        {
                                            "Effect": "Allow",
                                            "Principal": {"AWS": ["*"]},
                                            "Action": ["s3:GetObject"],
                                            "Resource": ["arn:aws:s3:::%s/*"]
                                        }
                                    ]
                                }
                                """.formatted(bucket);

                try {
                        minioClient.setBucketPolicy(SetBucketPolicyArgs.builder()
                                        .bucket(bucket)
                                        .config(policyJson)
                                        .build());
                } catch (Exception exception) {
                        throw new RuntimeException("Failed to configure public read access for object storage bucket", exception);
                }
        }

    private String trimTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }
}
