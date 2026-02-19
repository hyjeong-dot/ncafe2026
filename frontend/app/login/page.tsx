'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || '로그인에 실패했습니다.');
                return;
            }

            // 로그인 성공 → 관리자 페이지로 이동
            router.push('/admin');
        } catch {
            setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* 헤더 */}
                <div className={styles.header}>
                    <div className={styles.logoWrapper}>
                        <span className={styles.logoEmoji}>☕</span>
                    </div>
                    <h1 className={styles.title}>NCafe 2026</h1>
                    <p className={styles.subtitle}>관리자 로그인</p>
                </div>

                {/* 폼 영역 */}
                <div className={styles.body}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        {/* 에러 메시지 */}
                        {error && (
                            <div className={styles.errorMessage}>
                                <AlertCircle className={styles.errorIcon} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* 아이디 입력 */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="username" className={styles.label}>
                                아이디
                            </label>
                            <div className={styles.inputWrapper}>
                                <input
                                    id="username"
                                    type="text"
                                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                                    placeholder="아이디를 입력하세요"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                />
                                <User className={styles.inputIcon} />
                            </div>
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                비밀번호
                            </label>
                            <div className={styles.inputWrapper}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <Lock className={styles.inputIcon} />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className={styles.spinner} />
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    로그인
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* 푸터 */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        © 2026 NCafe. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
