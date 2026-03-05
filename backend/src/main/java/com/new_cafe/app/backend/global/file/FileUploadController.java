package com.new_cafe.app.backend.global.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/upload-file")
public class FileUploadController {

    @Value("${spring.web.resources.static-locations:file:./upload/}")
    private String uploadLocation;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // "file:./upload/" -> "./upload/"
            String cleanLocation = uploadLocation.replace("file:", "").split(",")[0].trim();
            Path uploadPath = Paths.get(cleanLocation, "images");
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created directory: " + uploadPath.toAbsolutePath());
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String storedFilename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(storedFilename);
            
            // Transfer to target file
            file.transferTo(filePath.toFile());
            System.out.println("File uploaded to: " + filePath.toAbsolutePath());

            // URL format expected by frontend: /upload/images/xxx.png
            String fileUrl = "/upload/images/" + storedFilename;
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("storedFilename", storedFilename);
            response.put("originalFilename", originalFilename);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
