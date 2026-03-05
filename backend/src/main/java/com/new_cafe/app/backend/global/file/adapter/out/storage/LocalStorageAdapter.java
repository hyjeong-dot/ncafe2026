package com.new_cafe.app.backend.global.file.adapter.out.storage;

import com.new_cafe.app.backend.global.file.application.port.out.SaveFilePort;
import com.new_cafe.app.backend.global.file.domain.FileInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class LocalStorageAdapter implements SaveFilePort, com.new_cafe.app.backend.global.file.application.port.out.DeleteFilePort {

    @Value("${spring.web.resources.static-locations:file:./upload/}")
    private String uploadLocation;

    @Override
    public void delete(String fileUrl) {
        try {
            // URL format: /upload/images/xxx.png or /images/xxx.png
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            
            String firstLocation = uploadLocation.split(",")[0].trim();
            String cleanLocation = firstLocation.replace("file:", "");
            Path uploadPath = Paths.get(cleanLocation, "images").toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(filename);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                System.out.println("DEBUG: Physical file deleted: " + filePath);
            } else {
                System.out.println("DEBUG: File not found for deletion: " + filePath);
            }
        } catch (Exception e) {
            System.err.println("WARN: Failed to delete physical file: " + fileUrl + " - " + e.getMessage());
        }
    }

    @Override
    public FileInfo save(MultipartFile file) {
        try {
            // "file:./upload/" -> "./upload/"
            String firstLocation = uploadLocation.split(",")[0].trim();
            String cleanLocation = firstLocation.replace("file:", "");
            Path uploadPath = Paths.get(cleanLocation, "images").toAbsolutePath().normalize();
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created upload directory: " + uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String storedFilename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(storedFilename);
            
            System.out.println("Attempting to save file to: " + filePath);
            
            try (java.io.InputStream inputStream = file.getInputStream()) {
                java.nio.file.Files.copy(inputStream, filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            }
            
            System.out.println("File saved successfully at: " + filePath.toAbsolutePath());

            // 기존 데이터와 일치시키기 위해 /upload/images/ 경로를 반환합니다.
            String fileUrl = "/upload/images/" + storedFilename;
            
            return FileInfo.builder()
                    .url(fileUrl)
                    .storedFilename(storedFilename)
                    .originalFilename(originalFilename)
                    .build();

        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to save uploaded file: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Could not save file: " + e.getMessage(), e);
        }
    }
}
