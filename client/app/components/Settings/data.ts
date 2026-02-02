export type SettingsItem = {
    id: string;
    icon: string;
    label: string;
};

export type SettingsSection = {
    id: string;
    items: SettingsItem[];
};

export const SECTIONS: SettingsSection[] = [
    {
        id: 'tai-khoan',
        items: [
            {
                id: 'thong-tin-ca-nhan',
                icon: 'person-outline',
                label: 'Thông tin cá nhân',
            },
            {
                id: 'dia-chi',
                icon: 'location-outline',
                label: 'Địa chỉ',
            },
        ],
    },
    {
        id: 'mua-sam',
        items: [
            {
                id: 'gio-hang',
                icon: 'cart-outline',
                label: 'Giỏ hàng',
            },
            {
                id: 'yeu-thich',
                icon: 'heart-outline',
                label: 'Yêu thích',
            },
            {
                id: 'thong-bao',
                icon: 'notifications-outline',
                label: 'Thông báo',
            },
            {
                id: 'phuong-thuc-thanh-toan',
                icon: 'card-outline',
                label: 'Phương thức thanh toán',
            },
        ],
    },
    {
        id: 'ho-tro',
        items: [
            {
                id: 'cau-hoi-thuong-gap',
                icon: 'help-circle-outline',
                label: 'Câu hỏi thường gặp',
            },
            {
                id: 'danh-gia-nguoi-dung',
                icon: 'chatbubbles-outline',
                label: 'Đánh giá người dùng',
            },
            {
                id: 'cai-dat',
                icon: 'settings-outline',
                label: 'Cài đặt',
            },
        ],
    },
];
