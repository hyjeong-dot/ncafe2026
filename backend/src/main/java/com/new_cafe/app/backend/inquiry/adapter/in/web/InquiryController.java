package com.new_cafe.app.backend.inquiry.adapter.in.web;

import com.new_cafe.app.backend.inquiry.adapter.in.web.dto.CreateInquiryRequest;
import com.new_cafe.app.backend.inquiry.adapter.in.web.dto.InquiryResponse;
import com.new_cafe.app.backend.inquiry.application.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    private String getUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return auth.getName();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InquiryResponse create(@RequestBody CreateInquiryRequest request) {
        return inquiryService.createInquiry(getUsername(), request.getTitle(), request.getContent(), request.getCategory());
    }

    @GetMapping("/my")
    public List<InquiryResponse> getMyInquiries() {
        return inquiryService.getMyInquiries(getUsername());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInquiry(@PathVariable Long id) {
        inquiryService.deleteInquiry(getUsername(), id);
    }
}
