"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import styles from "./MyPageFavorites.module.css";
// MenuCard를 재사용하기 위해 가져옵니다. 경로가 깊으므로 확인 필요.
import MenuCard from "../../../menus/_components/MenuCard/MenuCard";

export default function MyPageFavorites() {
    // 임시 더미 데이터 (나중에 백엔드 연동)
    const favorites: any[] = []; 

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
