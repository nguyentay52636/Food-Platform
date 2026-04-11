"use client"

import { useMemo, useState } from "react"
import type { Transaction, User, Wallet } from "@/lib/types/buiding"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { safeRandomUuid } from "@/lib/safe-crypto"

const CURRENCY = "vi-VN"
const MIN_DEPOSIT = 10000
type DepositMethod = "qr" | "visa" | "paypal" | "bank"

function formatVnd(amount: number) {
    return amount.toLocaleString(CURRENCY, {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    })
}

const MOCK_USER: User = {
    id: "user-1",
    createdAt: "2026-01-15T08:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z",
    email: "admin@foodplatform.vn",
    name: "Nguyen Van Admin",
    avatar: "https://i.pravatar.cc/240?img=12",
    role: "admin",
}

const INITIAL_WALLET: Wallet = {
    userId: "user-1",
    balance: 2500000,
    currency: "VND",
}

const INITIAL_TRANSACTIONS: Transaction[] = [
    {
        id: "txn-1",
        createdAt: "2026-02-28T08:00:00.000Z",
        updatedAt: "2026-02-28T08:00:00.000Z",
        userId: "user-1",
        amount: 500000,
        type: "deposit",
        status: "success",
        description: "Nạp tiền qua ví điện tử",
    },
    {
        id: "txn-2",
        createdAt: "2026-02-27T10:15:00.000Z",
        updatedAt: "2026-02-27T10:15:00.000Z",
        userId: "user-1",
        amount: 120000,
        type: "purchase",
        status: "success",
        description: "Mua gói khám phá 7 ngày",
    },
]

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function mapTransactionType(type: Transaction["type"]) {
    switch (type) {
        case "deposit":
            return "Nạp tiền"
        case "purchase":
            return "Thanh toán"
        case "refund":
            return "Hoàn tiền"
        default:
            return type
    }
}

function mapTransactionStatus(status: Transaction["status"]) {
    switch (status) {
        case "success":
            return "Thành công"
        case "pending":
            return "Đang xử lý"
        case "failed":
            return "Thất bại"
        default:
            return status
    }
}

function mapDepositMethod(method: DepositMethod) {
    switch (method) {
        case "qr":
            return "VietQR"
        case "visa":
            return "Visa/Mastercard"
        case "paypal":
            return "PayPal"
        case "bank":
            return "Chuyển khoản ngân hàng"
        default:
            return method
    }
}

export default function Profile() {
    const [user] = useState<User>(MOCK_USER)
    const [wallet, setWallet] = useState<Wallet>(INITIAL_WALLET)
    const [transactions, setTransactions] =
        useState<Transaction[]>(INITIAL_TRANSACTIONS)
    const [depositAmount, setDepositAmount] = useState("")
    const [note, setNote] = useState("")
    const [depositMethod, setDepositMethod] = useState<DepositMethod>("qr")
    const [error, setError] = useState("")

    const totalDeposit = useMemo(
        () =>
            transactions
                .filter((tx) => tx.type === "deposit" && tx.status === "success")
                .reduce((sum, tx) => sum + tx.amount, 0),
        [transactions]
    )

    const totalPurchase = useMemo(
        () =>
            transactions
                .filter((tx) => tx.type === "purchase" && tx.status === "success")
                .reduce((sum, tx) => sum + tx.amount, 0),
        [transactions]
    )

    const latestTransaction = transactions[0]

    const onDeposit = () => {
        const parsed = Number(depositAmount)
        if (!Number.isFinite(parsed) || parsed < MIN_DEPOSIT) {
            setError(`Số tiền nạp tối thiểu là ${formatVnd(MIN_DEPOSIT)}.`)
            return
        }

        setError("")
        const now = new Date().toISOString()
        const newTransaction: Transaction = {
            id: safeRandomUuid(),
            createdAt: now,
            updatedAt: now,
            userId: user.id,
            amount: parsed,
            type: "deposit",
            status: "success",
            description:
                note.trim() || `Nạp tiền qua ${mapDepositMethod(depositMethod)}`,
        }

        setWallet((prev) => ({ ...prev, balance: prev.balance + parsed }))
        setTransactions((prev) => [newTransaction, ...prev])
        setDepositAmount("")
        setNote("")
    }

    return (
        <div className="h-full overflow-y-auto p-4 md:p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:gap-6">
                <Card className="overflow-hidden py-0">
                    <div className="h-24 bg-gradient-to-r from-primary/90 via-primary to-primary/70" />
                    <CardContent className="-mt-12 grid gap-4 px-6 pb-6 pt-0 md:grid-cols-[auto_1fr_auto] md:items-center">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-lg font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <Badge variant="secondary" className="capitalize">
                                    {user.role}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">
                                Thành viên từ {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:justify-end">
                            <Badge variant="outline">ID: {user.id}</Badge>
                            <Badge variant="outline">
                                Cập nhật: {new Date(user.updatedAt).toLocaleDateString("vi-VN")}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Ví tài khoản</CardTitle>
                            <CardDescription>
                                Tóm tắt tài sản và dòng tiền trong tài khoản của bạn.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Số dư hiện có</p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {formatVnd(wallet.balance)}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Tổng đã nạp</p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {formatVnd(totalDeposit)}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-muted-foreground">Tổng đã chi</p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {formatVnd(totalPurchase)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Nạp tiền</CardTitle>
                            <CardDescription>
                                Nạp thêm vào ví để thanh toán dịch vụ.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Hình thức nạp</p>
                                <Select
                                    value={depositMethod}
                                    onValueChange={(value) => setDepositMethod(value as DepositMethod)}
                                >
                                    <SelectTrigger className="h-9 w-full">
                                        <SelectValue placeholder="Chọn hình thức nạp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="qr">VietQR</SelectItem>
                                        <SelectItem value="visa">Visa/Mastercard</SelectItem>
                                        <SelectItem value="paypal">PayPal</SelectItem>
                                        <SelectItem value="bank">Chuyển khoản ngân hàng</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {depositMethod === "qr" &&
                                        "Quét mã VietQR để thanh toán nhanh qua app ngân hàng."}
                                    {depositMethod === "visa" &&
                                        "Thanh toán bằng thẻ Visa/Mastercard quốc tế."}
                                    {depositMethod === "paypal" &&
                                        "Nạp tiền trực tiếp từ tài khoản PayPal."}
                                    {depositMethod === "bank" &&
                                        "Chuyển khoản thủ công, hệ thống sẽ đối soát sau khi nhận tiền."}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Số tiền (VND)</p>
                                <Input
                                    type="number"
                                    min={MIN_DEPOSIT}
                                    step={10000}
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="Ví dụ: 100000"
                                />
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {[50000, 100000, 200000, 500000].map((amount) => (
                                        <Button
                                            key={amount}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDepositAmount(String(amount))}
                                        >
                                            {formatVnd(amount)}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <Input
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Nạp qua ngân hàng / ví điện tử..."
                                />
                            </div>
                            {error ? <p className="text-sm text-destructive">{error}</p> : null}
                            <Button className="w-full" onClick={onDeposit}>
                                Xác nhận nạp tiền
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="py-0">
                    <CardHeader>
                        <CardTitle>Lịch sử giao dịch</CardTitle>
                        <CardDescription>
                            Các giao dịch gần đây của tài khoản.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {latestTransaction ? (
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                                Giao dịch gần nhất:{" "}
                                <span className="font-medium">
                                    {latestTransaction.description || "Giao dịch tài khoản"} -{" "}
                                    {formatVnd(latestTransaction.amount)}
                                </span>
                            </div>
                        ) : null}
                        {transactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-medium">
                                        {tx.description || "Giao dịch tài khoản"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(tx.createdAt).toLocaleString("vi-VN")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={tx.type === "deposit" ? "secondary" : "outline"}>
                                        {mapTransactionType(tx.type)}
                                    </Badge>
                                    <Badge
                                        variant={
                                            tx.status === "success"
                                                ? "default"
                                                : tx.status === "pending"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {mapTransactionStatus(tx.status)}
                                    </Badge>
                                    <span
                                        className={`text-sm font-semibold ${tx.type === "purchase" ? "text-destructive" : "text-emerald-600"
                                            }`}
                                    >
                                        {tx.type === "purchase" ? "-" : "+"}
                                        {formatVnd(tx.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
