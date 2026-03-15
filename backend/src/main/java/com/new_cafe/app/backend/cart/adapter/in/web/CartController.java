package com.new_cafe.app.backend.cart.adapter.in.web;

import com.new_cafe.app.backend.cart.application.port.in.AddCartItemUseCase;
import com.new_cafe.app.backend.cart.application.port.in.ClearCartUseCase;
import com.new_cafe.app.backend.cart.application.port.in.GetCartItemsUseCase;
import com.new_cafe.app.backend.cart.application.port.in.RemoveCartItemUseCase;
import com.new_cafe.app.backend.cart.application.port.in.UpdateCartItemUseCase;
import com.new_cafe.app.backend.cart.application.command.RemoveCartItemCommand;
import com.new_cafe.app.backend.cart.application.command.UpdateCartItemCommand;
import com.new_cafe.app.backend.cart.application.command.ClearCartCommand;
import com.new_cafe.app.backend.cart.application.result.CartItemResult;
import com.new_cafe.app.backend.cart.adapter.in.web.dto.CartItemRequest;
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

    private final GetCartItemsUseCase getCartItemsUseCase;
    private final AddCartItemUseCase addCartItemUseCase;
    private final UpdateCartItemUseCase updateCartItemUseCase;
    private final RemoveCartItemUseCase removeCartItemUseCase;
    private final ClearCartUseCase clearCartUseCase;
    private final LoadMemberPort loadMemberPort;

    private Member getCurrentMember() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return loadMemberPort.findByUsername(auth.getName()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getMyCart() {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        
        List<CartItemResult> items = getCartItemsUseCase.getCartItems(member.getId());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/items")
    public ResponseEntity<?> addItem(@RequestBody CartItemRequest request) {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        
        addCartItemUseCase.addItem(request.toAddCommand(member.getId()));
        return ResponseEntity.ok(Map.of("message", "장바구니에 추가되었습니다."));
    }

    /**
     * 수량 변경 - cartItemId(DB PK) 기반
     */
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long cartItemId, @RequestBody CartItemRequest request) {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        
        UpdateCartItemCommand command = UpdateCartItemCommand.builder()
                .memberId(member.getId())
                .cartItemId(cartItemId)
                .quantity(request.getQuantity())
                .build();
        updateCartItemUseCase.updateQuantity(command);
        return ResponseEntity.ok(Map.of("message", "수량이 변경되었습니다."));
    }

    /**
     * 삭제 - cartItemId(DB PK) 기반
     */
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long cartItemId) {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        
        RemoveCartItemCommand command = RemoveCartItemCommand.builder()
                .memberId(member.getId())
                .cartItemId(cartItemId)
                .build();
                
        removeCartItemUseCase.removeItem(command);
        return ResponseEntity.ok(Map.of("message", "상품이 삭제되었습니다."));
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart() {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        
        ClearCartCommand command = ClearCartCommand.builder()
                .memberId(member.getId())
                .build();
                
        clearCartUseCase.clearCart(command);
        return ResponseEntity.ok(Map.of("message", "장바구니가 비워졌습니다."));
    }
}
