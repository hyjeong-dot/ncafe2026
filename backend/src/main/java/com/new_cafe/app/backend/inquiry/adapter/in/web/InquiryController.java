package com.new_cafe.app.backend.inquiry.adapter.in.web;

import com.new_cafe.app.backend.inquiry.adapter.in.web.dto.CreateInquiryRequest;
import com.new_cafe.app.backend.inquiry.adapter.in.web.dto.InquiryResponse;
import com.new_cafe.app.backend.inquiry.application.service.InquiryService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InquiryResponse create(HttpSession session, @RequestBody CreateInquiryRequest request) {
        String username = (String) session.getAttribute("username");
        if (username == null) throw new IllegalStateException("로그인이 필요합니다.");
        return inquiryService.createInquiry(username, request.getTitle(), request.getContent(), request.getCategory());
    }

    @GetMapping("/my")
    public List<InquiryResponse> getMyInquiries(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) throw new IllegalStateException("로그인이 필요합니다.");
        return inquiryService.getMyInquiries(username);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInquiry(HttpSession session, @PathVariable Long id) {
        String username = (String) session.getAttribute("username");
        if (username == null) throw new IllegalStateException("로그인이 필요합니다.");
        inquiryService.deleteInquiry(username, id);
    }
}
