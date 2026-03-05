package com.new_cafe.app.backend.global.file.domain;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileInfo {
    private final String url;
    private final String storedFilename;
    private final String originalFilename;
}
