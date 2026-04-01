import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDestinations, saveDestinations, getItineraries, saveItineraries } from '@/services/QuanLyDuLich';

export type DestinationType = 'biển' | 'núi' | 'thành phố';

export interface Destination {
	id: string;
	name: string;
	type: DestinationType;
	price: number;
	rating: number;
	description: string;
	duration: number; // phút tham quan
	costAnUong: number;
	costLuuTru: number;
	costDiChuyen: number;
	image: string;
}

export interface ItineraryItem {
	id: string;
	destinationId: string;
	day: number;
	order: number;
}

export interface Itinerary {
	id: string;
	name: string;
	items: ItineraryItem[];
	createdAt: string;
}

export default () => {
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [itineraries, setItineraries] = useState<Itinerary[]>([]);
	const [budgetLimit, setBudgetLimit] = useState<number>(15000000);
	const [selectedItineraryId, setSelectedItineraryId] = useState<string>('');
	const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
	const [adminEditItem, setAdminEditItem] = useState<Destination | null>(null);

	useEffect(() => {
		const loadedDestinations = getDestinations();
		const loadedItineraries = getItineraries();
		setDestinations(loadedDestinations);
		setItineraries(loadedItineraries);
		setSelectedItineraryId(loadedItineraries[0]?.id || '');
	}, []);

	const saveDestinationsToStorage = useCallback((next: Destination[]) => {
		setDestinations(next);
		saveDestinations(next);
	}, []);

	const saveItinerariesToStorage = useCallback((next: Itinerary[]) => {
		setItineraries(next);
		saveItineraries(next);
	}, []);

	const addDestination = useCallback((dest: Destination) => {
		const next = [dest, ...destinations];
		saveDestinationsToStorage(next);
	}, [destinations, saveDestinationsToStorage]);

	const updateDestination = useCallback((dest: Destination) => {
		const next = destinations.map((item) => (item.id === dest.id ? dest : item));
		saveDestinationsToStorage(next);
	}, [destinations, saveDestinationsToStorage]);

	const removeDestination = useCallback((id: string) => {
		const next = destinations.filter((item) => item.id !== id);
		saveDestinationsToStorage(next);
	}, [destinations, saveDestinationsToStorage]);

	const addItinerary = useCallback((name: string) => {
		const newItem: Itinerary = {
			id: `itn-${Date.now()}`,
			name,
			items: [],
			createdAt: new Date().toISOString(),
		};
		const next = [newItem, ...itineraries];
		saveItinerariesToStorage(next);
		setSelectedItineraryId(newItem.id);
	}, [itineraries, saveItinerariesToStorage]);

	const removeItinerary = useCallback((id: string) => {
		const next = itineraries.filter((it) => it.id !== id);
		saveItinerariesToStorage(next);
	}, [itineraries, saveItinerariesToStorage]);

	const getCurrentItinerary = useMemo(() => itineraries.find((it) => it.id === selectedItineraryId) ?? itineraries[0], [itineraries, selectedItineraryId]);

	const appendDestinationToItinerary = useCallback(
		(destinationId: string, day: number) => {
			if (!getCurrentItinerary) return;
			const existing = getCurrentItinerary.items.filter((item) => item.day === day);
			const item: ItineraryItem = {
				id: `item-${Date.now()}`,
				destinationId,
				day,
				order: existing.length + 1,
			};
			const updatedItinerary: Itinerary = {
				...getCurrentItinerary,
				items: [...getCurrentItinerary.items, item],
			};
			const next = itineraries.map((it) => (it.id === updatedItinerary.id ? updatedItinerary : it));
			saveItineraries(next);
		},
		[getCurrentItinerary, itineraries, saveItineraries],
	);

	const removeItineraryItem = useCallback(
		(itemId: string) => {
			if (!getCurrentItinerary) return;
			const updatedItinerary: Itinerary = {
				...getCurrentItinerary,
				items: getCurrentItinerary.items.filter((item) => item.id !== itemId),
			};
			const next = itineraries.map((it) => (it.id === updatedItinerary.id ? updatedItinerary : it));
			saveItineraries(next);
		},
		[getCurrentItinerary, itineraries, saveItineraries],
	);

	const reorderItineraryItem = useCallback(
		(itemId: string, direction: 'up' | 'down') => {
			if (!getCurrentItinerary) return;
			const items = [...getCurrentItinerary.items];
			const index = items.findIndex((item) => item.id === itemId);
			if (index < 0) return;
			const target = direction === 'up' ? index - 1 : index + 1;
			if (target < 0 || target >= items.length) return;
			const temp = items[index];
			items[index] = items[target];
			items[target] = temp;
			const updated: Itinerary = { ...getCurrentItinerary, items: items.map((i, iIndex) => ({ ...i, order: iIndex + 1 })) };
			const next = itineraries.map((it) => (it.id === updated.id ? updated : it));
			saveItineraries(next);
		},
		[getCurrentItinerary, itineraries, saveItineraries],
	);

	const totalItineraryBudget = useMemo(() => {
		if (!getCurrentItinerary) return 0;
		return getCurrentItinerary.items.reduce((sum, item) => {
			const dest = destinations.find((d) => d.id === item.destinationId);
			if (!dest) return sum;
			return sum + dest.costAnUong + dest.costLuuTru + dest.costDiChuyen;
		}, 0);
	}, [destinations, getCurrentItinerary]);

	const totalTravelTime = useMemo(() => {
		if (!getCurrentItinerary) return 0;
		return getCurrentItinerary.items.reduce((sum, item) => {
			const dest = destinations.find((d) => d.id === item.destinationId);
			if (!dest) return sum;
			return sum + dest.duration + 60; // giả định 1h di chuyển mỗi điểm
		}, 0);
	}, [destinations, getCurrentItinerary]);

	const statistics = useMemo(() => {
		const totalTrips = itineraries.length;
		const popular: Record<string, number> = {};
		itineraries.forEach((it) => {
			it.items.forEach((item) => {
				const d = destinations.find((t) => t.id === item.destinationId);
				if (!d) return;
				popular[d.name] = (popular[d.name] || 0) + 1;
			});
		});
		const popularList = Object.entries(popular)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([name, count]) => ({ name, count }));
		const totalRevenue = itineraries.reduce((sum, it) => {
			return sum + it.items.reduce((s, item) => {
				const dest = destinations.find((d) => d.id === item.destinationId);
				if (!dest) return s;
				return s + dest.price;
			}, 0);
		}, 0);
		const totalBudgetCategory = itineraries.reduce(
			(sum, it) => {
				it.items.forEach((item) => {
					const dest = destinations.find((d) => d.id === item.destinationId);
					if (!dest) return;
					sum.anUong += dest.costAnUong;
					sum.luuTru += dest.costLuuTru;
					sum.diChuyen += dest.costDiChuyen;
				});
				return sum;
			},
			{ anUong: 0, luuTru: 0, diChuyen: 0 },
		);
		return { totalTrips, popularList, totalRevenue, totalBudgetCategory };
	}, [destinations, itineraries]);

	return {
		destinations,
		itineraries,
		selectedItineraryId,
		getCurrentItinerary,
		budgetLimit,
		totalItineraryBudget,
		totalTravelTime,
		statistics,
		isAdminModalVisible,
		adminEditItem,
		setIsAdminModalVisible,
		setAdminEditItem,
		setSelectedItineraryId,
		setBudgetLimit,
		addDestination,
		updateDestination,
		removeDestination,
		addItinerary,
		removeItinerary,
		appendDestinationToItinerary,
		removeItineraryItem,
		reorderItineraryItem,
	};
};
