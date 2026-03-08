'use client';

import Image from 'next/image';
import styles from '../login.module.css';

interface LoginHeroProps {
    title: string;
    description: React.ReactNode;
}

export default function LoginHero({ title, description }: LoginHeroProps) {
    return (
        <div className={styles.imageSection}>
            <div className={styles.dittoImageWrapper}>
                <Image
                    src="/images/ditto/welcome-ditto.png"
                    alt="Welcome Ditto"
                    fill
                    className={styles.welcomeImage}
                    priority
                />
            </div>
            <div className={styles.welcomeText}>
                <div className={styles.welcomeTitle}>{title}</div>
                <p className={styles.welcomeDesc}>
                    {description}
                </p>
            </div>
        </div>
    );
}
