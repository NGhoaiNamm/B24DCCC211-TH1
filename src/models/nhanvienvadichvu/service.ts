import { useState, useEffect } from "react";
import { getServices, saveServices } from "@/services/NhanVienVaDichVu/service";

export interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
}

export default function useServiceModel() {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        setServices(getServices());
    }, []);

    const addService = (service: Service) => {
        const newData = [...services, service];
        setServices(newData);
        saveServices(newData);
    };

    const deleteService = (id: string) => {
        const newData = services.filter((s) => s.id !== id);
        setServices(newData);
        saveServices(newData);
    };

    return {
        services,
        addService,
        deleteService,
    };
}