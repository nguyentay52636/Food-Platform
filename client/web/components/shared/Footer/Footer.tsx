import React from 'react'
import {
    ChefHat,
    MapPinned,
    Facebook,
    Instagram,
    Twitter,
    MapPin,
    Video,
    Calendar,
    Globe,
    Mail,
    Phone,
    Shield
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Footer() {

    return (
        <>
            <footer className="border-t py-16 bg-card/50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                {/* <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                                    <ChefHat className="w-7 h-7 text-primary-foreground" />
                                </div> */}
                                <img src="/logochinh.png" alt="Logo" className="w-20 h-20 z-10" />
                                <div>
                                    <h3 className="font-bold text-lg">Sài Gòn ẩm thực</h3>
                                    <p className="text-sm text-muted-foreground">Khám phá ẩm thực Sài Gòn</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Nền tảng kết nối thực khách với những món ăn ngon nhất tại Sài Gòn. Khám phá địa điểm, sự kiện và trải nghiệm ẩm thực độc đáo.
                            </p>
                            <div className="flex items-center gap-4">
                                <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                                    <Facebook className="h-5 w-5" />
                                </Button>
                                <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                                    <Instagram className="h-5 w-5" />
                                </Button>
                                <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                                    <Twitter className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-lg">Khám phá</h4>
                            <ul className="space-y-3 text-muted-foreground">
                                <li>
                                    <Link href="/map" className="hover:text-foreground transition-colors flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Bản đồ nhà hàng
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/livestream" className="hover:text-foreground transition-colors flex items-center gap-2">
                                        <Video className="h-4 w-4" />
                                        Livestream
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/events" className="hover:text-foreground transition-colors flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Sự kiện
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/explore" className="hover:text-foreground transition-colors flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        Khám phá
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4 text-lg">Liên hệ</h4>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <MapPinned className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 flex-shrink-0" />
                                    <span>0123 456 789</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 flex-shrink-0" />
                                    <span>contact@saigonfood.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t pt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                            <p>© 2024 Sài Gòn ẩm thực. Tất cả quyền được bảo lưu.</p>
                            <div className="flex items-center gap-6">
                                <Link href="/privacy" className="hover:text-foreground transition-colors">
                                    Chính sách bảo mật
                                </Link>
                                <Link href="/terms" className="hover:text-foreground transition-colors">
                                    Điều khoản sử dụng
                                </Link>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Bảo mật SSL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
