"use client";

import { Suspense } from "react";
import { MyPageMain } from "./_components";

export default function MyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyPageMain />
        </Suspense>
    );
}
