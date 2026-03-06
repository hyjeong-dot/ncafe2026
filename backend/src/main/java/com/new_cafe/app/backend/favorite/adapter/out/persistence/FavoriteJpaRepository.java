package com.new_cafe.app.backend.favorite.adapter.out.persistence;

import com.new_cafe.app.backend.favorite.domain.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FavoriteJpaRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByMemberIdAndMenuId(UUID memberId, Long menuId);
    List<Favorite> findByMemberId(UUID memberId);
}
