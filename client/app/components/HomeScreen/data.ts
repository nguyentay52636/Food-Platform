import type { Region } from 'react-native-maps';
import type { Place } from './types';

export const INITIAL_REGION: Region = {
    latitude: 10.7552,
    longitude: 106.7058,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

export const PLACES: Place[] = [
    {
        id: '1',
        name: 'Quán Ốc Vĩnh Khánh',
        address: 'Vĩnh Khánh, Quận 4, TP. HCM',
        latitude: 10.7556,
        longitude: 106.7052,
        category: 'food',
        rating: 8.5,
        distance: '0.3 km',
        thumbnail: 'https://images.pexels.com/photos/3298180/pexels-photo-3298180.jpeg',
        menu: [
            { id: 'm1', name: 'Ốc len xào dừa', rating: 9.0 },
            { id: 'm2', name: 'Sò điệp nướng mỡ hành', rating: 8.8 },
            { id: 'm3', name: 'Ngao hấp xả', rating: 8.7 },
        ],
    },
    {
        id: '2',
        name: 'Quán Nướng Vĩnh Khánh',
        address: 'Vĩnh Khánh, Quận 4, TP. HCM',
        latitude: 10.7549,
        longitude: 106.7061,
        category: 'food',
        rating: 8.9,
        distance: '0.5 km',
        thumbnail: 'https://images.pexels.com/photos/4106483/pexels-photo-4106483.jpeg',
        menu: [
            { id: 'm4', name: 'Ba rọi nướng tảng', rating: 9.1 },
            { id: 'm5', name: 'Bạch tuộc nướng sa tế', rating: 8.9 },
            { id: 'm6', name: 'Đùi gà nướng mật ong', rating: 8.6 },
        ],
    },
    {
        id: '3',
        name: 'Cà phê Vĩnh Khánh',
        address: 'Vĩnh Khánh, Quận 4, TP. HCM',
        latitude: 10.7558,
        longitude: 106.707,
        category: 'coffee',
        rating: 8.2,
        distance: '0.4 km',
        thumbnail: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
        menu: [
            { id: 'm7', name: 'Cà phê sữa đá', rating: 8.8 },
            { id: 'm8', name: 'Bạc xỉu', rating: 8.5 },
            { id: 'm9', name: 'Trà đào cam sả', rating: 8.7 },
        ],
    },
];

