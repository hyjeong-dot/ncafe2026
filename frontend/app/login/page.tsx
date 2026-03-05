'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { User, Lock, Eye, EyeOff, AlertCircle, LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

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

            const result = await response.json();

            if (!response.ok || !result.success) {
                setError(result.message || '로그인에 실패했습니다.');
                return;
            }

            // Global Auth State Update
            login({
                username: result.data.username,
                role: result.data.role
            });

            // 로그인 성공 → 권한에 따라 이동
            // window.location.href를 사용: router.replace는 클라이언트 라우팅이라
            // 세션 쿠키가 브라우저에 완전히 반영되기 전에 미들웨어가 가로채서 실패할 수 있음
            if (result.data.role === 'ROLE_ADMIN') {
                window.location.href = '/admin';
            } else {
                const searchParams = new URLSearchParams(window.location.search);
                let redirectTo = searchParams.get('redirect') || '/';

                if (redirectTo.startsWith('/admin')) {
                    toast.error("어드민 권한이 없어요! 💜");
                    redirectTo = '/';
                }

                window.location.href = redirectTo;
            }
        } catch (err) {
            setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

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
                        <div className={styles.welcomeTitle}>안녕! 반가워요 💜</div>
                        <p className={styles.welcomeDesc}>
                            말랑한 메타몽 바리스타가 기다리고 있어요.<br />
                            아이디와 비밀번호를 입력해 주세요! ✨
                        </p>
                    </div>
                </div>

                {/* 로그인 카드 */}
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            <Image
                                src="/images/ditto/favicon-ditto.png"
                                alt="Ditto"
                                width={40}
                                height={40}
                                className={styles.titleIcon}
                            />
                            메타몽 카페 로그인
                        </h1>
                        <p className={styles.subtitle}>맛있는 커피가 준비되고 있어요! ☕</p>
                    </div>

                    <div className={styles.body}>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            {error && (
                                <div className={styles.errorMessage}>
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className={styles.inputGroup}>
                                <label htmlFor="username" className={styles.label}>아이디</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        id="username"
                                        type="text"
                                        className={styles.input}
                                        placeholder="아이디를 입력하세요"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoComplete="username"
                                        autoFocus
                                    />
                                    <User size={18} className={styles.inputIcon} />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password" className={styles.label}>비밀번호</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className={styles.input}
                                        placeholder="비밀번호를 입력하세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                    />
                                    <Lock size={18} className={styles.inputIcon} />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Image
                                            src="/images/ditto/ditto-activities.png"
                                            alt="Loading..."
                                            width={24}
                                            height={24}
                                            className={styles.loadingDitto}
                                        />
                                        <span>변신중... 💜</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={20} />
                                        로그인 할까요? 💜
                                    </>
                                )}
                            </button>
                        </form>

                        <div className={styles.signupPrompt}>
                            <span>아직 메타몽 친구가 아니에요? 🫠</span>
                            <Link href="/signup" className={styles.signupLink}>
                                변신해서 가입하기 →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

