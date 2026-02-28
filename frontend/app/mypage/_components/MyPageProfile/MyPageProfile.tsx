"use client";

import styles from "./MyPageProfile.module.css";
interface User {
    username: string;
    role: string;
}

interface MyPageProfileProps {
    user: User;
}

export default function MyPageProfile({ user }: MyPageProfileProps) {
    return (
        <div className={styles.content}>
            <div className={styles.settingsForm}>
                <h3 className={styles.sectionTitle}>계정 설정</h3>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>아이디</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={user.username}
                        readOnly
                        disabled
                    />
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        아이디는 변경할 수 없어요.
                    </p>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>닉네임</label>
                    <input
                        className={styles.input}
                        type="text"
                        defaultValue={user.username}
                        placeholder="사용하실 이름을 알려주세요!"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>비밀번호 변경</label>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="새 비밀번호를 입력해주세요"
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="한 번 더 입력해주세요"
                        style={{ marginTop: 'var(--space-2)' }}
                    />
                </div>

                <button className={styles.saveButton}>
                    변경내용 저장할까요? 💜
                </button>
            </div>
        </div>
    );
}
