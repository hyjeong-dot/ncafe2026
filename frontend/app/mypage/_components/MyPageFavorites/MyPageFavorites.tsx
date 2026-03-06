"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import LoadingDitto from "@/components/common/LoadingDitto/LoadingDitto";
import MenuCard from "../../../menus/_components/MenuCard/MenuCard";
import styles from "./MyPageFavorites.module.css";

export default function MyPageFavorites() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await fetchAPI('/favorites');
                setFavorites(data?.menus || []);
            } catch (err) {
                console.error("Failed to fetch favorites:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (isLoading) {
        return (
            <div className={styles.content}>
                <LoadingDitto message="찜한 메뉴를 가져오고 있어요... 💜" />
            </div>
        );
    }

    return (
        <div className={styles.content}>
            <h3 className={styles.sectionTitle}>
                <Heart size={20} fill="#a855f7" stroke="#a855f7" /> 
                내가 찜한 메뉴
            </h3>
            
            {favorites.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>💜</div>
                    <p>아직 찜한 메뉴가 없어요.<br />마음에 드는 메뉴를 하트로 담아보세요!</p>
                    <Link href="/menus" className={styles.menuLink}>메뉴 보러 가기</Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {favorites.map((menu) => (
                        <MenuCard key={menu.id} menu={menu} />
                    ))}
                </div>
            )}
        </div>
    );
}
