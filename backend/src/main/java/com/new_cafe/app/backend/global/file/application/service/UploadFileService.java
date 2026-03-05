package com.new_cafe.app.backend.global.file.application.service;

import com.new_cafe.app.backend.global.file.application.port.in.UploadFileUseCase;
import com.new_cafe.app.backend.global.file.application.port.out.SaveFilePort;
import com.new_cafe.app.backend.global.file.domain.FileInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UploadFileService implements UploadFileUseCase {

    private final SaveFilePort saveFilePort;

    @Override
    public FileInfo uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be empty");
        }
        return saveFilePort.save(file);
    }
}
