package com.new_cafe.app.backend.global.file.adapter.out.storage;

import com.new_cafe.app.backend.global.file.application.port.out.SaveFilePort;
import com.new_cafe.app.backend.global.file.domain.FileInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class LocalStorageAdapter implements SaveFilePort {

    @Value("${spring.web.resources.static-locations:file:./upload/}")
    private String uploadLocation;

    @Override
    public FileInfo save(MultipartFile file) {
        try {
            // "file:./upload/" -> "./upload/"
            String cleanLocation = uploadLocation.replace("file:", "").split(",")[0].trim();
            Path uploadPath = Paths.get(cleanLocation, "images");
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String storedFilename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(storedFilename);
            
            file.transferTo(filePath.toFile());

            String fileUrl = "/upload/images/" + storedFilename;
            
            return FileInfo.builder()
                    .url(fileUrl)
                    .storedFilename(storedFilename)
                    .originalFilename(originalFilename)
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Could not save file", e);
        }
    }
}
