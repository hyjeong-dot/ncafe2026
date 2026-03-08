'use client';

import LoginHero from './_components/LoginHero';
import LoginForm from './_components/LoginForm';
import styles from './login.module.css';

/**
 * 로그인 페이지
 * 브랜딩 이미지(LoginHero)와 로그인 폼(LoginForm)으로 분리되었습니다.
 */
export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.loginWrapper}>
                {/* 1. 메타몽 브랜드 이미지 섹션 */}
                <LoginHero 
                    title="안녕! 반가워요 💜"
                    description={
                        <>
                            말랑한 메타몽 바리스타가 기다리고 있어요.<br />
                            아이디와 비밀번호를 입력해 주세요! ✨
                        </>
                    }
                />

                {/* 2. 로그인 입력 카드 섹션 */}
                <LoginForm />
            </div>
        </div>
    );
}
