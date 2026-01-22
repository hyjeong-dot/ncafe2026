import { ReactNode } from 'react';
import AdminSidebar from './_components/AdminSidebar';
import styles from './layout.module.css';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className={styles.layout}>
            <AdminSidebar />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
