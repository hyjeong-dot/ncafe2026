package com.new_cafe.app.backend.inquiry.adapter.in.web;

import com.new_cafe.app.backend.inquiry.adapter.in.web.dto.AnswerInquiryRequest;
import com.new_cafe.app.backend.inquiry.adapter.in.web.dto.InquiryResponse;
import com.new_cafe.app.backend.inquiry.application.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/inquiries")
@RequiredArgsConstructor
public class AdminInquiryController {

    private final InquiryService inquiryService;

    @GetMapping
    public List<InquiryResponse> getAllInquiries(@RequestParam(required = false) String status) {
        return inquiryService.getAllInquiries(status);
    }

    @PatchMapping("/{id}/answer")
    public InquiryResponse answerInquiry(@PathVariable Long id, @RequestBody AnswerInquiryRequest request) {
        return inquiryService.answerInquiry(id, request.getAnswer());
    }

    @GetMapping("/waiting-count")
    public Map<String, Long> getWaitingCount() {
        return Map.of("count", inquiryService.getWaitingCount());
    }
}
