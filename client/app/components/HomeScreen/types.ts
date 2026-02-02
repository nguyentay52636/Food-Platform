export type MenuItem = {
    id: string;
    name: string;
    rating: number;
};

export type Place = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: 'food' | 'coffee' | 'other';
    rating: number;
    distance: string;
    thumbnail: string;
    menu: MenuItem[];
};

