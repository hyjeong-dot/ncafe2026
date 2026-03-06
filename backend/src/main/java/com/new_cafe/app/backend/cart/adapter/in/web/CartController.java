package com.new_cafe.app.backend.cart.adapter.in.web;

import com.new_cafe.app.backend.cart.application.port.in.ManageCartUseCase;
import com.new_cafe.app.backend.cart.application.result.CartItemResult;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final ManageCartUseCase manageCartUseCase;
    private final LoadMemberPort loadMemberPort;

    private Member getCurrentMember() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return loadMemberPort.findByNickname(auth.getName()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getMyCart() {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        List<CartItemResult> items = manageCartUseCase.getCartItems(member.getId());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/items")
    public ResponseEntity<?> addItem(@RequestBody CartItemRequest request) {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        manageCartUseCase.addItem(member.getId(), request.getMenuId(), request.getQuantity());
        return ResponseEntity.ok(Map.of("message", "장바구니에 추가되었습니다."));
    }

    @PutMapping("/items/{menuId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long menuId, @RequestBody CartItemRequest request) {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        manageCartUseCase.updateQuantity(member.getId(), menuId, request.getQuantity());
        return ResponseEntity.ok(Map.of("message", "수량이 변경되었습니다."));
    }

    @DeleteMapping("/items/{menuId}")
    public ResponseEntity<?> removeItem(@PathVariable Long menuId) {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        manageCartUseCase.removeItem(member.getId(), menuId);
        return ResponseEntity.ok(Map.of("message", "상품이 삭제되었습니다."));
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart() {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        manageCartUseCase.clearCart(member.getId());
        return ResponseEntity.ok(Map.of("message", "장바구니가 비워졌습니다."));
    }
}
