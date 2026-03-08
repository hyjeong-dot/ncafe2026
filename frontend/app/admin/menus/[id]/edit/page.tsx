'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MenuEditContainer from './_components/MenuEditContainer';
import styles from './page.module.css';

interface EditMenuPageProps {
    params: Promise<{
        id: string;
    }>;
}

/**
 * 어드민 메뉴 수정 페이지
 * 메뉴 정보를 불러오고 폼을 초기화하는 로직은 MenuEditContainer로 분리되었습니다.
 */
export default function EditMenuPage({ params }: EditMenuPageProps) {
    const { id } = use(params);
    const menuId = Number(id);

    return (
        <div className={styles.container}>
            {/* 뒤로 가기 버튼 */}
            <Link href={`/admin/menus/${menuId}`} className={styles.backButton}>
                <ArrowLeft size={20} />
                <span>상세 페이지로 돌아가기</span>
            </Link>

            {/* 헤더 섹션 */}
            <header className={styles.header}>
                <h1 className={styles.title}>메뉴 수정</h1>
                <p className={styles.subtitle}>메뉴 정보를 수정합니다</p>
            </header>

            {/* 수정 컨테이너 (비즈니스 로직 & 폼 렌더링) */}
            <MenuEditContainer menuId={menuId} />
        </div>
    );
}
