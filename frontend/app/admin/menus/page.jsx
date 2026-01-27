'use client';

import { Menu } from '@/types/menu';
import { useEffect, useState } from "react";
import CategoryList from './_components/CategoryList';


export default function MenusPage() {
    const [menus, setMenus] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    useEffect(() => {
        // 메뉴 API 호출
        const fetchMenus = async () => {
            const response = await fetch('http://localhost:8080/admin/menus');
            const data = await response.json();
            setMenus(data);
        }
        fetchMenus();
    }, []);

    const handleCategoryChange = (categoryId) => {
        console.log('선택된 카테고리:', categoryId);
        setSelectedCategoryId(categoryId);
    };

    const filteredMenus = menus.filter(menu =>
        selectedCategoryId === null || menu.category === selectedCategoryId
    );

    return (
        <main>
            <h1>Menus</h1>

            {/* 카테고리 목록 */}
            <CategoryList onCategoryChange={handleCategoryChange} />

            {/* 메뉴 목록 */}
            <section>
                <h2>Menu List</h2>
                {filteredMenus.map(menu => (
                    <div key={menu.id}>
                        <div>{menu.korName}</div>
                        <div>{menu.engName}</div>
                        <div>{menu.description}</div>
                        <div>{menu.price}</div>
                    </div>
                ))}
            </section>

        </main>
    );
}