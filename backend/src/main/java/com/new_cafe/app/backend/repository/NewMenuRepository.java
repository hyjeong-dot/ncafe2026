package com.new_cafe.app.backend.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.new_cafe.app.backend.entity.Menu;

@Component
public class NewMenuRepository implements MenuRepository {
    @Override
    public List<Menu> findAll() {
        List<Menu> menus = new ArrayList<>();
        try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(
                getClass().getResourceAsStream("/menus.csv"), java.nio.charset.StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                // 첫 줄(헤더)이거나 데이터가 "id"로 시작하면 건너뜁니다.
                if (line.startsWith("id"))
                    continue;
                String[] attributes = line.split(",");
                if (attributes.length < 6)
                    continue;
                Long id = Long.parseLong(attributes[0].trim());
                String korName = attributes[1].trim();
                String engName = attributes[2].trim();
                String description = attributes[3].trim();
                String price = attributes[4].trim();
                String image = attributes[5].trim();

                Menu menu = new Menu(id, korName, engName, description, price, image);
                menus.add(menu);
            }
        } catch (Exception e) {
            e.printStackTrace();
            // 에러 발생 시 리스트에 가짜 데이터를 하나 넣어 브라우저에 표시되게 함
            menus.add(new Menu(0L, "에러 발생!", e.toString(), "CSV 파일 읽기 실패", "0", "error.jpg"));

            System.out.println("메뉴를 불러오는데 실패했습니다.");
        }
        return menus;
    }
}
