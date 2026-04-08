"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/shared/Footer/Footer";
import { HeaderAuth } from "@/components/shared/Header/HeaderAuth/HeaderAuth";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/auth/") ?? false;
    const isAdminPage = pathname?.startsWith("/admin") ?? false;
    const isOwnerPage = pathname?.startsWith("/owner") ?? false;

    return (
        <>
            {/* <DynamicLang /> */}
            {!isAuthPage && !isAdminPage && !isOwnerPage}
            {children}
            {!isAuthPage && !isAdminPage && !isOwnerPage}
        </>
    );
}