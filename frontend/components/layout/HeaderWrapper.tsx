"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import CartDrawer from "@/components/layout/CartDrawer";

export function HeaderWrapper() {
    const pathname = usePathname();
    const isAdminMode = pathname?.startsWith("/admin");

    if (isAdminMode) return null;

    return (
        <>
            <Header />
            <CartDrawer />
        </>
    );
}
