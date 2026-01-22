import Link from 'next/link';
import { Plus } from 'lucide-react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actionHref: string;
    actionLabel: string;
}

export default function PageHeader({ title, subtitle, actionHref, actionLabel }: PageHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.titleSection}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            <Link href={actionHref} className={styles.addButton}>
                <Plus size={20} />
                {actionLabel}
            </Link>
        </header>
    );
}
