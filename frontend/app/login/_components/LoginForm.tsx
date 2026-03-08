'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from '../login.module.css';
import toast from 'react-hot-toast';

export default function LoginForm() {
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

            // Redirect based on role
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
    );
}
