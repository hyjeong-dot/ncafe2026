'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    variant?: 'default' | 'danger';
}

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    variant = 'default',
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    // Portal을 사용하여 body 바로 아래에 렌더링 (z-index 문제 방지)
    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    {description && <p className={styles.description}>{description}</p>}
                </div>

                <div className={styles.footer}>
                    <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
                        {cancelText}
                    </button>
                    {onConfirm && (
                        <button
                            className={`${styles.button} ${variant === 'danger' ? styles.dangerButton : styles.confirmButton
                                }`}
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
