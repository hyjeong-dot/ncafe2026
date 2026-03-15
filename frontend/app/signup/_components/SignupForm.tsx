'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, User, Lock, Eye, EyeOff, AlertCircle, Mail, Phone, Smile, CheckSquare, Square } from 'lucide-react';
import styles from '@/app/login/login.module.css';
import Modal from '@/components/common/Modal/Modal';

export default function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 숫자만 남김
        const value = e.target.value.replace(/[^0-9]/g, '');
        let formattedValue = '';
        
        if (value.length < 4) {
            formattedValue = value;
        } else if (value.length < 8) {
            formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else {
            formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
        }
        
        setPhoneNumber(formattedValue);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // 아이디 검증
        if (username.trim().length < 3) {
            setError('아이디는 3자 이상 입력해주세요.');
            return;
        }

        // 비밀번호 검증
        if (password.length < 6) {
            setError('비밀번호는 6자 이상이어야 합니다.');
            return;
        }

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 닉네임 검증
        if (nickname.trim().length < 2) {
            setError('닉네임은 2자 이상 입력해주세요.');
            return;
        }

        // 이메일 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        // 전화번호 검증 (010-0000-0000 형식)
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError('전화번호를 올바르게 입력해주세요. (예: 010-1234-5678)');
            return;
        }

        if (!termsAgreed) {
            setError('이용약관 및 개인정보 처리방침에 동의해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username, 
                    password, 
                    nickname, 
                    email, 
                    phoneNumber 
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || '회원가입에 실패했습니다.');
                setIsLoading(false);
                return;
            }

            setIsModalOpen(true);
        } catch (err) {
            setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <div className={styles.titleIcon}>
                        <UserPlus size={24} color="#a87edb" />
                    </div>
                    <span>회원가입</span>
                </h1>
                <div className={styles.subtitle}>
                    메타몽 바리스타와 친구 맺기 💜
                </div>
            </div>

            <div className={styles.body}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorMessage}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>아이디</label>
                        <div className={styles.inputWrapper}>
                            <User size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                                placeholder="사용할 아이디를 입력하세요"
                                required
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>비밀번호</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.togglePassword}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>비밀번호 확인</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input}
                                placeholder="비밀번호를 다시 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="nickname" className={styles.label}>닉네임</label>
                        <div className={styles.inputWrapper}>
                            <Smile size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className={styles.input}
                                placeholder="사용할 닉네임을 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>이메일</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.inputIcon} />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                placeholder="example@ncafe.com"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="phoneNumber" className={styles.label}>휴대폰 번호</label>
                        <div className={styles.inputWrapper}>
                            <Phone size={18} className={styles.inputIcon} />
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className={styles.input}
                                placeholder="010-0000-0000"
                                maxLength={13}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.termsGroup}>
                        <label className={styles.termsLabel}>
                            <input
                                type="checkbox"
                                checked={termsAgreed}
                                onChange={(e) => setTermsAgreed(e.target.checked)}
                                className={styles.hiddenCheckbox}
                            />
                            <div className={styles.customCheckbox}>
                                {termsAgreed ? <CheckSquare size={20} color="#a87edb" /> : <Square size={20} color="#ddd" />}
                            </div>
                            <span className={styles.termsText}>
                                [필수] 이용약관 및 개인정보 처리방침에 동의합니다.
                            </span>
                        </label>
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
                                <UserPlus size={20} />
                                가입하기 💜
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.signupPrompt}>
                    <span>이미 메타몽과 친구신가요? 🫠</span>
                    <Link href="/login" className={styles.signupLink}>
                        로그인하러 가기 →
                    </Link>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => router.replace('/login')}
                title="회원가입 완료"
                description="회원가입이 완료되었습니다. 로그인해주세요! 🫠"
                confirmText="로그인"
                cancelText="닫기"
                variant="ditto"
            />
        </div>
    );
}
