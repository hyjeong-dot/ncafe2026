package com.new_cafe.app.backend.global.file.application.service;

import com.new_cafe.app.backend.global.file.application.port.in.DeleteFileUseCase;
import com.new_cafe.app.backend.global.file.application.port.out.DeleteFilePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteFileService implements DeleteFileUseCase {

    private final DeleteFilePort deleteFilePort;

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }
        deleteFilePort.delete(fileUrl);
    }
}
