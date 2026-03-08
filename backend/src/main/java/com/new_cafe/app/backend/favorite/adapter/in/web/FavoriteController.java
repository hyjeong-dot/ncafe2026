package com.new_cafe.app.backend.favorite.adapter.in.web;

import com.new_cafe.app.backend.favorite.application.port.in.CheckFavoriteUseCase;
import com.new_cafe.app.backend.favorite.application.port.in.GetFavoriteMenusUseCase;
import com.new_cafe.app.backend.favorite.application.port.in.ToggleFavoriteUseCase;
import com.new_cafe.app.backend.favorite.application.command.CheckFavoriteCommand;
import com.new_cafe.app.backend.favorite.application.result.CheckFavoriteResult;
import com.new_cafe.app.backend.favorite.application.result.FavoriteMenuListResult;
import com.new_cafe.app.backend.favorite.application.result.ToggleFavoriteResult;
import com.new_cafe.app.backend.favorite.adapter.in.web.dto.ToggleFavoriteRequest;
import com.new_cafe.app.backend.auth.domain.exception.AuthenticationFailedException;
import com.new_cafe.app.backend.member.application.port.out.LoadMemberPort;
import com.new_cafe.app.backend.member.domain.model.Member;
import com.new_cafe.app.backend.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final ToggleFavoriteUseCase toggleFavoriteUseCase;
    private final GetFavoriteMenusUseCase getFavoriteMenusUseCase;
    private final CheckFavoriteUseCase checkFavoriteUseCase;
    private final LoadMemberPort loadMemberPort;

    private Optional<UUID> getMemberId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return Optional.empty();
        }
        return loadMemberPort.findByNickname(auth.getName())
                .map(Member::getId);
    }

    private UUID getMemberIdOrThrow() {
        return getMemberId().orElseThrow(AuthenticationFailedException::new);
    }

    @PostMapping
    public ToggleFavoriteResult toggleFavorite(@RequestBody ToggleFavoriteRequest request) {
        return toggleFavoriteUseCase.toggleFavorite(request.toCommand(getMemberIdOrThrow()));
    }

    @GetMapping
    public FavoriteMenuListResult getMyFavorites() {
        return getFavoriteMenusUseCase.getFavoriteMenus(getMemberIdOrThrow());
    }

    @GetMapping("/{menuId}/check")
    public CheckFavoriteResult checkIfFavorite(@PathVariable Long menuId) {
        return getMemberId()
                .map(memberId -> {
                    CheckFavoriteCommand command = CheckFavoriteCommand.builder()
                            .memberId(memberId)
                            .menuId(menuId)
                            .build();
                    return checkFavoriteUseCase.isFavorite(command);
                })
                .orElseGet(() -> CheckFavoriteResult.builder().isFavorite(false).build());
    }
}
