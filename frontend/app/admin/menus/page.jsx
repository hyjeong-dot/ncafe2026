"use client";
import { useEffect, useState } from "react";
// 1. 컴포넌트와 스타일 가져오기
import PageHeader from "./_components/PageHeader/PageHeader";
import MenuStats from "./_components/MenuStats/MenuStats";
import MenuFilterBar from "./_components/MenuFilterBar/MenuFilterBar";
import MenuGrid from "./_components/MenuGrid/MenuGrid";
// import styles from "./MenuGrid/MenuGrid.module.css";
export default function MenusPage() {
    const [menus, setMenus] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
    useEffect(() => {
        fetch("http://localhost:8080/admin/menus")
            .then(res => res.json())
            .then(setMenus);
    }, []);
    // 2. 가짜 데이터 및 함수들 (에러 방지용)
    const stats = [
        { label: "전체 메뉴", value: menus.length, icon: "📋" },
        { label: "품절", value: 0, icon: "🚫" }
    ];
    const mockCategories = [{ id: "all", korName: "전체" }];
    const menuCounts = { all: menus.length };

    // 3. 기존에 배웠던 매핑 (백엔드 데이터를 화면용으로 변환)
    const mappedMenus = menus.map(m => ({
        ...m,
        id: String(m.id),
        category: { korName: "카테고리", icon: "☕" },
        images: m.image ? [{ url: m.image, isPrimary: true }] : [],
        isSoldOut: false
    }));
    return (
        <main style={{ padding: '20px' }}>
            {/* 제목 부분 */}
            <PageHeader
                title="메뉴 관리"
                subtitle="실시간 백엔드 데이터와 연결됨"
                actionHref="/admin/menus/new"
                actionLabel="새 메뉴 추가"
            />
            {/* 통계 부분 */}
            <MenuStats stats={stats} />
            {/* 필터 부분 */}
            <MenuFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={mockCategories}
                selectedCategory="all"
                onSelectCategory={() => { }}
                menuCounts={menuCounts}
            />
            {/* 실제 카드 목록 */}
            <MenuGrid
                menus={mappedMenus}
                isSearching={!!searchQuery}
                onToggleSoldOut={(id) => console.log('Sold out toggled', id)}
                onDelete={(id) => console.log('Delete menu', id)}
            />
        </main>
    );
}

