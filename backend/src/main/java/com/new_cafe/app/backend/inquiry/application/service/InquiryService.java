package com.new_cafe.app.backend.inquiry.application.service;

import com.new_cafe.app.backend.inquiry.adapter.in.web.dto.InquiryResponse;
import com.new_cafe.app.backend.inquiry.domain.model.Inquiry;
import com.new_cafe.app.backend.inquiry.domain.model.InquiryStatus;
import com.new_cafe.app.backend.inquiry.domain.repository.InquiryRepository;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final LoadMemberPort loadMemberPort;

    /** 사용자: 문의 작성 */
    @Transactional
    public InquiryResponse createInquiry(String username, String title, String content, String category) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        Inquiry inquiry = Inquiry.builder()
                .memberId(member.getId())
                .title(title)
                .content(content)
                .category(category)
                .build();

        return InquiryResponse.from(inquiryRepository.save(inquiry), member.getNickname());
    }

    /** 사용자: 내 문의 목록 */
    @Transactional(readOnly = true)
    public List<InquiryResponse> getMyInquiries(String username) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        return inquiryRepository.findAllByMemberIdOrderByCreatedAtDesc(member.getId()).stream()
                .map(i -> InquiryResponse.from(i, member.getNickname()))
                .collect(Collectors.toList());
    }

    /** 사용자: 문의 삭제 (대기중만) */
    @Transactional
    public void deleteInquiry(String username, Long id) {
        Member member = loadMemberPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));

        if (!inquiry.getMemberId().equals(member.getId())) {
            throw new IllegalStateException("본인의 문의만 삭제할 수 있습니다.");
        }
        if (inquiry.getStatus() != InquiryStatus.WAITING) {
            throw new IllegalStateException("대기중인 문의만 삭제할 수 있습니다.");
        }

        inquiryRepository.delete(inquiry);
    }

    /** 관리자: 전체 목록 */
    @Transactional(readOnly = true)
    public List<InquiryResponse> getAllInquiries(String statusFilter) {
        List<Inquiry> list;
        if (statusFilter != null && !statusFilter.isEmpty()) {
            list = inquiryRepository.findAllByStatusOrderByCreatedAtDesc(InquiryStatus.valueOf(statusFilter));
        } else {
            list = inquiryRepository.findAllByOrderByCreatedAtDesc();
        }
        return list.stream()
                .map(i -> {
                    String nickname = loadMemberPort.findById(i.getMemberId())
                            .map(Member::getNickname)
                            .orElse("탈퇴한 회원");
                    return InquiryResponse.from(i, nickname);
                })
                .collect(Collectors.toList());
    }

    /** 관리자: 답변 작성 */
    @Transactional
    public InquiryResponse answerInquiry(Long id, String answer) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));

        inquiry.answerInquiry(answer);
        inquiryRepository.save(inquiry);

        String nickname = loadMemberPort.findById(inquiry.getMemberId())
                .map(Member::getNickname)
                .orElse("탈퇴한 회원");

        return InquiryResponse.from(inquiry, nickname);
    }

    /** 관리자: 대기중 문의 건수 */
    @Transactional(readOnly = true)
    public long getWaitingCount() {
        return inquiryRepository.countByStatus(InquiryStatus.WAITING);
    }
}
