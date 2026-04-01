import type { Destination, Itinerary } from '@/models/quanLyDuLich';

const DESTINATION_KEY = 'travel_destinations';
const ITINERARY_KEY = 'travel_itineraries';

const defaultDestinations: Destination[] = [
    {
        id: '1',
        name: 'Vịnh Hạ Long',
        type: 'biển',
        price: 2500000,
        rating: 4.8,
        description: 'Du thuyền, hang động và nghỉ dưỡng trên vịnh.',
        duration: 180,
        costAnUong: 500000,
        costLuuTru: 1200000,
        costDiChuyen: 300000,
        image: 'https://tse3.mm.bing.net/th/id/OIP.wBNNbqjveKbsyuJZktu8uAHaEK?pid=Api&P=0&h=220',
    },
    {
        id: '2',
        name: 'Sa Pa',
        type: 'núi',
        price: 1800000,
        rating: 4.5,
        description: 'Trekking ruộng bậc thang, cáp treo Fansipan.',
        duration: 240,
        costAnUong: 400000,
        costLuuTru: 800000,
        costDiChuyen: 350000,
        image: 'https://www.getvisavietnam.com/wp-content/uploads/2023/06/Y-Linh-Ho-Village-Sapa.jpg',
    },
    {
        id: '3',
        name: 'Hội An',
        type: 'thành phố',
        price: 1400000,
        rating: 4.7,
        description: 'Phố cổ, ẩm thực đường phố, văn hóa.',
        duration: 120,
        costAnUong: 300000,
        costLuuTru: 600000,
        costDiChuyen: 200000,
        image: 'https://tse1.mm.bing.net/th/id/OIP.EnznTgBSzPxXBtQKSFgpsQHaEK?pid=Api&P=0&h=220',
    },
];

const defaultItineraries: Itinerary[] = [
    {
        id: 'itn-1',
        name: 'Hành trình 3 ngày miền Bắc',
        items: [],
        createdAt: new Date().toISOString(),
    },
];

function safeParse<T>(value: string | null, fallback: T): T {
    if (!value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

export const getDestinations = (): Destination[] => {
    return safeParse<Destination[]>(localStorage.getItem(DESTINATION_KEY), defaultDestinations);
};

export const saveDestinations = (destinations: Destination[]) => {
    localStorage.setItem(DESTINATION_KEY, JSON.stringify(destinations));
};

export const getItineraries = (): Itinerary[] => {
    return safeParse<Itinerary[]>(localStorage.getItem(ITINERARY_KEY), defaultItineraries);
};

export const saveItineraries = (itineraries: Itinerary[]) => {
    localStorage.setItem(ITINERARY_KEY, JSON.stringify(itineraries));
};
