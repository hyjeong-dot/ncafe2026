package com.new_cafe.app.backend.favorite.adapter.in.web;

import com.new_cafe.app.backend.favorite.application.port.in.ManageFavoriteUseCase;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final ManageFavoriteUseCase manageFavoriteUseCase;
    private final LoadMemberPort loadMemberPort;

    private Member getCurrentMember() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return loadMemberPort.findByNickname(auth.getName()).orElse(null);
    }

    @PostMapping("/{menuId}")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long menuId) {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        boolean isFavorite = manageFavoriteUseCase.toggleFavorite(member.getId(), menuId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    @GetMapping
    public ResponseEntity<?> getMyFavorites() {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.status(401).body(Map.of("message", "로그인이 필요합니다."));
        }
        List<Menu> menus = manageFavoriteUseCase.getFavoriteMenus(member.getId());
        return ResponseEntity.ok(menus);
    }

    @GetMapping("/{menuId}/check")
    public ResponseEntity<?> checkIfFavorite(@PathVariable Long menuId) {
        Member member = getCurrentMember();
        if (member == null) {
            return ResponseEntity.ok(Map.of("isFavorite", false));
        }
        boolean isFavorite = manageFavoriteUseCase.isFavorite(member.getId(), menuId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }
}
