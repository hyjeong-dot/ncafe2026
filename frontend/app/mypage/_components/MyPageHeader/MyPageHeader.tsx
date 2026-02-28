"use client";

import styles from "./MyPageHeader.module.css";

export default function MyPageHeader() {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>내 정보 💜</h1>
            <p className={styles.subtitle}>메타몽 카페에 오신 것을 환영해요!</p>
        </div>
    );
}
