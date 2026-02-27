'use client';

import Image from 'next/image';
import styles from './LoadingDitto.module.css';

interface LoadingDittoProps {
    message?: string;
    size?: number;
}

export default function LoadingDitto({ message = '메타몽이 변신 중...', size = 100 }: LoadingDittoProps) {
    return (
        <div className={styles.container}>
            <div className={styles.dittoWrapper}>
                <Image
                    src="/images/ditto/ditto-activities.png"
                    alt="Loading..."
                    width={size}
                    height={size}
                    className={styles.ditto}
                />
            </div>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}
