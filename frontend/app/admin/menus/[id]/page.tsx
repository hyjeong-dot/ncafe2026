'use client';

import { use } from 'react';
import styles from './page.module.css';
import AdminMenuDetailContainer from './_components/AdminMenuDetailContainer';

interface MenuDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

/**
 * 어드민 메뉴 상세 페이지
 * 메뉴 삭제 로직과 레이아웃 구성은 AdminMenuDetailContainer로 분리되었습니다.
 */
export default function MenuDetailPage({ params }: MenuDetailPageProps) {
    const { id: idStr } = use(params);
    const id = Number(idStr);

    return (
        <div className={styles.container}>
            <AdminMenuDetailContainer id={id} />
        </div>
    );
}
