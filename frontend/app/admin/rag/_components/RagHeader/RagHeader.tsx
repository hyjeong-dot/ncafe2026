import React from 'react';
import styles from './RagHeader.module.css';

export default function RagHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.titleSection}>
                <h1 className={styles.title}>RAG 지식 관리 🪄</h1>
                <p className={styles.subtitle}>AI '바리스타 메타몽'에게 줄 지식 데이터를 관리합니다.</p>
            </div>
        </header>
    );
}
