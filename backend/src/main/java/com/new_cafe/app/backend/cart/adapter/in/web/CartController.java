package com.new_cafe.app.backend.cart.adapter.in.web;

import com.new_cafe.app.backend.cart.application.port.in.*;
import com.new_cafe.app.backend.cart.application.command.ClearCartCommand;
import com.new_cafe.app.backend.cart.application.command.RemoveCartItemCommand;
import com.new_cafe.app.backend.cart.application.result.CartItemResult;
import com.new_cafe.app.backend.cart.adapter.in.web.dto.CartItemRequest;
import com.new_cafe.app.backend.cart.adapter.in.web.dto.UpdateQuantityRequest;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

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

    private UUID getMemberId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return loadMemberPort.findByUsername(auth.getName())
                .map(Member::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "회원 정보를 찾을 수 없습니다."));
    }

    @GetMapping
    public List<CartItemResult> getMyCart() {
        return getCartItemsUseCase.getCartItems(getMemberId());
    }

    @PostMapping("/items")
    public void addItem(@RequestBody CartItemRequest request) {
        addCartItemUseCase.addItem(request.toCommand(getMemberId()));
    }

    @PutMapping("/items/{cartItemId}")
    public void updateQuantity(@PathVariable Long cartItemId, @RequestBody UpdateQuantityRequest request) {
        updateCartItemUseCase.updateQuantity(request.toCommand(getMemberId(), cartItemId));
    }

    @DeleteMapping("/items/{cartItemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@PathVariable Long cartItemId) {
        removeCartItemUseCase.removeItem(
                RemoveCartItemCommand.builder().memberId(getMemberId()).cartItemId(cartItemId).build());
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart() {
        clearCartUseCase.clearCart(
                ClearCartCommand.builder().memberId(getMemberId()).build());
    }
}
