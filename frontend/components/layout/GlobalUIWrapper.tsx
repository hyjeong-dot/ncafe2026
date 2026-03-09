"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatAgent from "@/components/common/ChatAgent/ChatAgent";
import CartDrawer from "@/components/layout/CartDrawer";

export default function GlobalUIWrapper() {
    const pathname = usePathname();
    const isAdminMode = pathname?.startsWith("/admin");

    if (isAdminMode) {
        return null; // 관리자 페이지에서는 일반 고객용 UI를 모두 숨김
    }

    return (
        <>
            <Header />
            <Footer />
            <ChatAgent />
            <CartDrawer />
        </>
    );
}
