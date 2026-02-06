import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import Button from '@/components/common/Button/Button';
import styles from '../page.module.css';

interface MenuDetailHeaderProps {
    menuId: string;
    onDeleteClick: () => void;
}

export default function MenuDetailHeader({ menuId, onDeleteClick }: MenuDetailHeaderProps) {
    return (
        <div className={styles.header}>
            <Link href="/admin/menus" className={styles.backButton}>
                <ArrowLeft size={20} />
                <span>목록으로 돌아가기</span>
            </Link>
            <div className={styles.actions}>
                <Link href={`/admin/menus/${menuId}/edit`}>
                    <Button variant="primary" size="sm">
                        <Edit2 size={16} />
                        메뉴 수정하기
                    </Button>
                </Link>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={onDeleteClick}
                >
                    <Trash2 size={16} />
                    삭제
                </Button>
            </div>
        </div>
    );
}
