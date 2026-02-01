import React from 'react'
import Link from 'next/link'
import { ChefHat } from 'lucide-react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


export default function Header() {
    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex h-30 items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3  group">
                            {/* <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                <ChefHat className="w-7 h-7 text-primary-foreground" />
                            </div> */}
                            <img src="/logo.png" alt="logo" className="w-12 h-12 z-10" />
                            <div className="hidden sm:block">
                                <h1 className="text-2xl font-bold leading-tight">Sài Gòn ẩm thực</h1>
                                <p className="text-xs text-muted-foreground">Khám phá ẩm thực</p>
                            </div>
                        </Link>

                        <div className="hidden md:flex flex-1 max-w-xl mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm món ăn, địa điểm, bài viết..."
                                    className="pl-10 h-12 bg-muted/50 border-2 focus:border-primary"
                                />
                            </div>
                        </div>

                        <nav className="hidden lg:flex items-center gap-2 text-md" >
                            <Button asChild variant="ghost" size="default">
                                <Link href="#featured">Món nổi bật</Link>
                            </Button>
                            <Button asChild variant="ghost" size="default">
                                <Link href="#places">Địa điểm</Link>
                            </Button>
                            <Button asChild variant="ghost" size="default">
                                <Link href="#events">Sự kiện</Link>
                            </Button>
                            <Button asChild variant="ghost" size="default">
                                <Link href="#blog">Blog</Link>
                            </Button>
                        </nav>

                        <div className="flex items-center gap-2 text-md">
                            <Button asChild variant="ghost" size="default">
                                <Link href="/login">Đăng nhập</Link>
                            </Button>
                            <Button asChild variant="ghost" size="default">
                                <Link href="/login">Đăng ký</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
