import Link from "next/link"

export function Logo() {
    return (
        <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group mr-2"
        >
            <div className="">
                <img src="/logochinh.png" alt="logo" className="w-23 h-20 z-10" />
            </div>
            <div className="hidden sm:block">
                <h1 className="text-lg font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Saigon Culinary
                </h1>
                <p className="text-md text-muted-foreground font-medium">
                    Ẩm thực Việt Nam 🇻🇳
                </p>

            </div>
        </Link>
    )
}

