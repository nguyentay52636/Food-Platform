import type { Translations, LanguageCode } from "./client-types"

const vi: Translations = {
    common: {
        loading: "Đang tải...",
        error: "Đã xảy ra lỗi",
        retry: "Thử lại",
        close: "Đóng",
        back: "Quay lại",
        next: "Tiếp theo",
        previous: "Trước đó",
    },
    home: {
        title: "GPS Tours",
        subtitle: "Khám phá Đà Nẵng",
        searchPlaceholder: "Tìm kiếm địa điểm...",
        nearbyLocations: "Địa điểm lân cận",
        viewAll: "Xem tất cả",
        scanQR: "Quét QR",
    },
    poi: {
        directions: "Chỉ đường",
        playAudio: "Nghe thuyết minh",
        pauseAudio: "Tạm dừng",
        stopAudio: "Dừng",
        relatedLocations: "Địa điểm liên quan",
        noAudio: "Chưa có audio",
        audioLanguage: "Ngôn ngữ audio",
        viewDetail: "Xem chi tiết",
        locateOnMap: "Xem trên bản đồ",
    },
    settings: {
        title: "Cài đặt",
        language: "Ngôn ngữ",
        selectLanguage: "Chọn ngôn ngữ",
        about: "Về ứng dụng",
        version: "Phiên bản",
    },
    qr: {
        title: "Quét mã QR",
        instructions: "Hướng camera vào mã QR để bắt đầu",
        skip: "Bỏ qua",
        invalidQR: "Mã QR không hợp lệ",
    },
}

const en: Translations = {
    common: {
        loading: "Loading...",
        error: "An error occurred",
        retry: "Retry",
        close: "Close",
        back: "Back",
        next: "Next",
        previous: "Previous",
    },
    home: {
        title: "GPS Tours",
        subtitle: "Explore Da Nang",
        searchPlaceholder: "Search locations...",
        nearbyLocations: "Nearby Locations",
        viewAll: "View All",
        scanQR: "Scan QR",
    },
    poi: {
        directions: "Directions",
        playAudio: "Play Audio Guide",
        pauseAudio: "Pause",
        stopAudio: "Stop",
        relatedLocations: "Related Locations",
        noAudio: "No audio available",
        audioLanguage: "Audio Language",
        viewDetail: "View Details",
        locateOnMap: "Show on Map",
    },
    settings: {
        title: "Settings",
        language: "Language",
        selectLanguage: "Select Language",
        about: "About",
        version: "Version",
    },
    qr: {
        title: "Scan QR Code",
        instructions: "Point your camera at a QR code to start",
        skip: "Skip",
        invalidQR: "Invalid QR code",
    },
}

const zh: Translations = {
    common: {
        loading: "加载中...",
        error: "发生错误",
        retry: "重试",
        close: "关闭",
        back: "返回",
        next: "下一个",
        previous: "上一个",
    },
    home: {
        title: "GPS导览",
        subtitle: "探索岘港",
        searchPlaceholder: "搜索地点...",
        nearbyLocations: "附近景点",
        viewAll: "查看全部",
        scanQR: "扫描二维码",
    },
    poi: {
        directions: "导航",
        playAudio: "播放语音导览",
        pauseAudio: "暂停",
        stopAudio: "停止",
        relatedLocations: "相关景点",
        noAudio: "暂无语音",
        audioLanguage: "语音语言",
        viewDetail: "查看详情",
        locateOnMap: "在地图上显示",
    },
    settings: {
        title: "设置",
        language: "语言",
        selectLanguage: "选择语言",
        about: "关于",
        version: "版本",
    },
    qr: {
        title: "扫描二维码",
        instructions: "将相机对准二维码开始",
        skip: "跳过",
        invalidQR: "无效的二维码",
    },
}

const ja: Translations = {
    common: {
        loading: "読み込み中...",
        error: "エラーが発生しました",
        retry: "再試行",
        close: "閉じる",
        back: "戻る",
        next: "次へ",
        previous: "前へ",
    },
    home: {
        title: "GPSツアー",
        subtitle: "ダナンを探索",
        searchPlaceholder: "場所を検索...",
        nearbyLocations: "近くのスポット",
        viewAll: "すべて見る",
        scanQR: "QRスキャン",
    },
    poi: {
        directions: "道案内",
        playAudio: "音声ガイドを再生",
        pauseAudio: "一時停止",
        stopAudio: "停止",
        relatedLocations: "関連スポット",
        noAudio: "音声なし",
        audioLanguage: "音声言語",
        viewDetail: "詳細を見る",
        locateOnMap: "地図で表示",
    },
    settings: {
        title: "設定",
        language: "言語",
        selectLanguage: "言語を選択",
        about: "アプリについて",
        version: "バージョン",
    },
    qr: {
        title: "QRコードをスキャン",
        instructions: "カメラをQRコードに向けてください",
        skip: "スキップ",
        invalidQR: "無効なQRコード",
    },
}

export const translations: Record<LanguageCode, Translations> = { vi, en, zh, ja }

export function getTranslations(lang: LanguageCode): Translations {
    return translations[lang] || translations.en
}
