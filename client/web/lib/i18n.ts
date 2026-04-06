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
        title: "Phố Ẩm Thực",
        subtitle: "Vĩnh Khánh - Quận 4",
        searchPlaceholder: "Tìm quán ăn, món ăn...",
        nearbyLocations: "Quán ăn gần đây",
        favoriteLocations: "Quán ăn yêu thích",
        noFavoritesYet: "Chưa có quán yêu thích. Bấm trái tim ở trang chi tiết để lưu.",
        viewAll: "Xem tất cả",
        scanQR: "Quét QR",
    },
    poi: {
        directions: "Chỉ đường",
        playAudio: "Nghe thuyết minh",
        pauseAudio: "Tạm dừng",
        stopAudio: "Dừng",
        relatedLocations: "Quán ăn liên quan",
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
        instructions: "Hướng camera vào mã QR để xem thông tin quán",
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
        title: "Food Street",
        subtitle: "Vinh Khanh - District 4",
        searchPlaceholder: "Search restaurants, dishes...",
        nearbyLocations: "Nearby Restaurants",
        favoriteLocations: "Favorite Restaurants",
        noFavoritesYet: "No favorites yet. Tap the heart on a place’s detail page to save it.",
        viewAll: "View All",
        scanQR: "Scan QR",
    },
    poi: {
        directions: "Directions",
        playAudio: "Play Audio Guide",
        pauseAudio: "Pause",
        stopAudio: "Stop",
        relatedLocations: "Related Restaurants",
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
        instructions: "Point camera at QR code to view restaurant info",
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
        title: "美食街",
        subtitle: "永康 - 第四郡",
        searchPlaceholder: "搜索餐厅、美食...",
        nearbyLocations: "附近餐厅",
        favoriteLocations: "收藏的餐厅",
        noFavoritesYet: "暂无收藏。在详情页点击心形图标即可保存。",
        viewAll: "查看全部",
        scanQR: "扫描二维码",
    },
    poi: {
        directions: "导航",
        playAudio: "播放语音导览",
        pauseAudio: "暂停",
        stopAudio: "停止",
        relatedLocations: "相关餐厅",
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
        instructions: "将相机对准二维码查看餐厅信息",
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
        title: "フードストリート",
        subtitle: "ヴィンカン - 4区",
        searchPlaceholder: "レストラン、料理を検索...",
        nearbyLocations: "近くのレストラン",
        favoriteLocations: "お気に入り",
        noFavoritesYet: "お気に入りはまだありません。詳細ページのハートで保存できます。",
        viewAll: "すべて見る",
        scanQR: "QRスキャン",
    },
    poi: {
        directions: "道案内",
        playAudio: "音声ガイドを再生",
        pauseAudio: "一時停止",
        stopAudio: "停止",
        relatedLocations: "関連レストラン",
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
        instructions: "カメラをQRコードに向けてレストラン情報を見る",
        skip: "スキップ",
        invalidQR: "無効なQRコード",
    },
}

export const translations: Record<LanguageCode, Translations> = { vi, en, zh, ja }

export function getTranslations(lang: LanguageCode): Translations {
    return translations[lang] || translations.en
}
