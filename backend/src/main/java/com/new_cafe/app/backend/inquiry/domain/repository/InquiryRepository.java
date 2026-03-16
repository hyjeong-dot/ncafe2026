package com.new_cafe.app.backend.inquiry.domain.repository;

import com.new_cafe.app.backend.inquiry.domain.model.Inquiry;
import com.new_cafe.app.backend.inquiry.domain.model.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findAllByMemberIdOrderByCreatedAtDesc(UUID memberId);
    List<Inquiry> findAllByOrderByCreatedAtDesc();
    List<Inquiry> findAllByStatusOrderByCreatedAtDesc(InquiryStatus status);
    long countByStatus(InquiryStatus status);
}
