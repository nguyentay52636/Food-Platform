import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    return (
        <form className={cn("flex flex-col gap-6 w-full max-w-lg mx-auto", className)} {...props}>
            <FieldGroup className="px-6 py-8">
                <div className="flex flex-col items-center gap-3 text-center mb-8">
                    <h1 className="text-3xl font-bold">Tạo tài khoản mới</h1>
                    <p className="text-muted-foreground text-base text-balance">
                        Điền thông tin dưới đây để tạo tài khoản của bạn
                    </p>
                </div>
                <Field className="mb-2">
                    <FieldLabel htmlFor="name" className="text-lg">Họ và tên</FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="h-12 text-base"
                        required
                    />
                </Field>
                <Field className="mb-2">
                    <FieldLabel htmlFor="email" className="text-lg">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="email@vi-du.com"
                        className="h-12 text-base"
                        required
                    />
                    <FieldDescription className="text-base">
                        Chúng tôi sẽ sử dụng email này để liên hệ. Chúng tôi sẽ không chia sẻ email của bạn với ai khác.
                    </FieldDescription>
                </Field>
                <Field className="mb-6">
                    <FieldLabel htmlFor="password" className="text-lg">Mật khẩu</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        className="h-12 text-base"
                        required
                    />
                    <FieldDescription className="text-base">
                        Mật khẩu phải có ít nhất 8 ký tự.
                    </FieldDescription>
                </Field>
                <Field className="mb-6">
                    <FieldLabel htmlFor="confirm-password" className="text-lg">Xác nhận mật khẩu</FieldLabel>
                    <Input
                        id="confirm-password"
                        type="password"
                        className="h-12 text-base"
                        required
                    />
                    <FieldDescription className="text-base">
                        Vui lòng xác nhận mật khẩu của bạn.
                    </FieldDescription>
                </Field>
                <Field className="mb-6">
                    <Button type="submit" className="w-full h-12 text-lg font-semibold cursor-pointer">
                        Tạo tài khoản
                    </Button>
                </Field>
                <FieldSeparator className="text-base">Hoặc tiếp tục với</FieldSeparator>
                <Field>
                    <Button variant="outline" type="button" className="w-full h-12 text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
                            <path
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                fill="currentColor"
                            />
                        </svg>
                        Đăng ký với GitHub
                    </Button>
                    <FieldDescription className="text-center text-base mt-4">
                        Đã có tài khoản?{" "}
                        <Link href="/auth/login" className="underline underline-offset-4">
                            Đăng nhập
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
