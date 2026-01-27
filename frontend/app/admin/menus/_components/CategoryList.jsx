"use client";

import { useEffect, useState } from "react";

export default function CategoryList({ onCategoryChange }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch("http://localhost:8080/admin/categories");
            const data = await response.json();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleClick = (e, category) => {
        e.preventDefault();
        if (onCategoryChange)
            onCategoryChange(category);
    };

    return (
        <section>
            <h1>카테고리 블록</h1>
            <div>
                <button onClick={(e) => handleClick(e, null)}>전체</button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={(e) => handleClick(e, category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </section>
    );
}
