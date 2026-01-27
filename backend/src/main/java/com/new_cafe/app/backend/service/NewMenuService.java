package com.new_cafe.app.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.new_cafe.app.backend.entity.Menu;
import com.new_cafe.app.backend.repository.MenuRepository;

@Service // new MenuService를 대신 사용
public class NewMenuService implements MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Override
    public List<Menu> getAll() {
        try {
            return menuRepository.findAll();
        } catch (Exception e) {
            // 에러가 발생하면 런타임 예외로 감싸서 던지거나 다른 처리를 합니다.
            throw new RuntimeException("데이터를 가져오는 중 오류 발생", e);
        }
    }

    @Override
    public List<Menu> getAll(Integer categoryId) {
        return menuRepository.findAllByCategoryId(categoryId);
    }

}
