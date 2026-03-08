'use client';

import styles from '@/app/login/login.module.css';
import SignupForm from './_components/SignupForm';
import SignupHero from './_components/SignupHero';

/**
 * 회원가입 페이지
 * SignupHero와 SignupForm으로 분리되어 관리됩니다.
 */
export default function SignupPage() {
    return (
        <div className={styles.container}>
            <div className={styles.loginWrapper}>
                {/* 1. 이미지 섹션 */}
                <SignupHero />

                {/* 2. 회원가입 폼 가입 카드 */}
                <SignupForm />
            </div>
        </div>
    );
}
