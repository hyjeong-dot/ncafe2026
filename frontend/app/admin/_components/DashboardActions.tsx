'use client';

import Link from 'next/link';
import { Plus, UtensilsCrossed, ShoppingBag, Settings, Database } from 'lucide-react';
import styles from '../page.module.css';

export default function DashboardActions() {
    return (
        <div className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>빠른 작업</h2>
            <div className={styles.actionsGrid}>
                <Link href="/admin/menus/new" className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Plus size={22} />
                    </div>
                    <div className={styles.actionText}>
                        <p className={styles.actionTitle}>새 메뉴 추가</p>
                        <p className={styles.actionDesc}>메뉴를 등록하세요</p>
                    </div>
                </Link>

                <Link href="/admin/menus" className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <UtensilsCrossed size={22} />
                    </div>
                    <div className={styles.actionText}>
                        <p className={styles.actionTitle}>메뉴 관리</p>
                        <p className={styles.actionDesc}>메뉴 목록 보기</p>
                    </div>
                </Link>

                <Link href="/admin/orders" className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <ShoppingBag size={22} />
                    </div>
                    <div className={styles.actionText}>
                        <p className={styles.actionTitle}>주문 확인</p>
                        <p className={styles.actionDesc}>새 주문 3건</p>
                    </div>
                </Link>

                <Link href="/admin/rag" className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Database size={22} color="#8e44ad" />
                    </div>
                    <div className={styles.actionText}>
                        <p className={styles.actionTitle}>RAG 지식 관리</p>
                        <p className={styles.actionDesc}>AI의 공부 데이터 관리</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
