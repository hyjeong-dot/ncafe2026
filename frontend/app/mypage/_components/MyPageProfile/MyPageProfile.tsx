import { useState, useEffect } from "react";
import styles from "./MyPageProfile.module.css";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Lock, Save, AlertCircle } from "lucide-react";

interface UserData {
    id: string;
    username: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
}

export default function MyPageProfile() {
    const { updateUser } = useAuth();
    const [fullUser, setFullUser] = useState<UserData | null>(null);
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const result = await res.json();
                if (result.success && result.data) {
                    const data = result.data;
                    setFullUser(data);
                    setNickname(data.name || '');
                    setEmail(data.email || '');
                    setPhoneNumber(data.phoneNumber || '');
                }
            } catch (err) {
                console.error("Failed to fetch user profile", err);
            }
        };
        fetchUserData();
    }, []);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        let formattedValue = '';
        if (value.length < 4) formattedValue = value;
        else if (value.length < 8) formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
        else formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
        setPhoneNumber(formattedValue);
    };

    const handleSave = async () => {
        if (password && password !== confirmPassword) {
            toast.error("비밀번호가 일치하지 않아요! 😢");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nickname,
                    email,
                    phoneNumber,
                    password: password || undefined
                })
            });

            const result = await res.json();
            if (result.success) {
                toast.success("내 정보가 귀엽게 수정되었어요! 💜");
                updateUser(result.data);
                setPassword('');
                setConfirmPassword('');
            } else {
                toast.error(result.message || "수정에 실패했어요.");
            }
        } catch (err) {
            toast.error("서버 연결에 실패했어요.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!fullUser) return <div className={styles.content}>로딩 중...</div>;

    return (
        <div className={styles.content}>
            <div className={styles.settingsForm}>
                <h3 className={styles.sectionTitle}>계정 설정</h3>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        <div className={styles.labelWrapper}>
                            <User size={16} />
                            <span>아이디</span>
                        </div>
                    </label>
                    <input
                        className={styles.input}
                        type="text"
                        value={fullUser.username}
                        readOnly
                        disabled
                    />
                    <div className={styles.helperText}>
                        아이디는 변경할 수 없어요.
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        <div className={styles.labelWrapper}>
                            <User size={16} />
                            <span>닉네임</span>
                        </div>
                    </label>
                    <input
                        className={styles.input}
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="사용하실 이름을 알려주세요!"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        <div className={styles.labelWrapper}>
                            <Mail size={16} />
                            <span>이메일</span>
                        </div>
                    </label>
                    <input
                        className={styles.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@ncafe.com"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        <div className={styles.labelWrapper}>
                            <Phone size={16} />
                            <span>휴대폰 번호</span>
                        </div>
                    </label>
                    <input
                        className={styles.input}
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="010-0000-0000"
                        maxLength={13}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        <div className={styles.labelWrapper}>
                            <Lock size={16} />
                            <span>비밀번호 변경</span>
                        </div>
                    </label>
                    <input
                        className={styles.input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비워두면 기존 비밀번호가 유지됩니다"
                    />
                    <input
                        className={styles.input}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호를 한 번 더 입력해주세요"
                        style={{ marginTop: 'var(--space-2)' }}
                    />
                </div>

                <button 
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <div className={styles.labelWrapper}>
                        {isSaving ? (
                            <span>변경하는 중... 💜</span>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>변경내용 저장할까요? 💜</span>
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}
