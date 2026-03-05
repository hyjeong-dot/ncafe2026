'use client';

import Image from 'next/image';
import styles from '@/app/login/login.module.css';
import SignupForm from './_components/SignupForm';

export default function SignupPage() {
    return (
        <div className={styles.container}>
            <div className={styles.loginWrapper}>
                {/* 메타몽 이미지 섹션 */}
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
                        <div className={styles.welcomeTitle}>새로운 트레이너 환영!</div>
                        <p className={styles.welcomeDesc}>
                            말랑한 메타몽과 어서 친구가 되어주세요.<br />
                            아이디와 비밀번호를 입력해 주세요! ✨
                        </p>
                    </div>
                </div>

                {/* 회원가입 카드 */}
                <SignupForm />
            </div>
        </div>
    );
}
