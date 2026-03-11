import { useState, useEffect } from "react";
import { getStatistics, saveStatistics } from "@/services/NhanVienVaDichVu/statistics";

export interface StatisticsData {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    totalRevenue: number;
    appointmentsByDate: { [date: string]: number };
    revenueByService: { [serviceId: string]: number };
    revenueByEmployee: { [employeeId: string]: number };
    employeePerformance: {
        [employeeId: string]: {
            appointments: number;
            revenue: number;
            rating: number;
        };
    };
}

export default function useStatisticsModel() {
    const [statistics, setStatistics] = useState<StatisticsData>({
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        totalRevenue: 0,
        appointmentsByDate: {},
        revenueByService: {},
        revenueByEmployee: {},
        employeePerformance: {},
    });

    useEffect(() => {
        const data = getStatistics();
        if (data) {
            setStatistics(data);
        }
    }, []);

    const updateStatistics = (data: StatisticsData) => {
        setStatistics(data);
        saveStatistics(data);
    };

    const calculateStatistics = (appointments: any[], services: any[], reviews: any[]) => {
        const stats: StatisticsData = {
            totalAppointments: appointments.length,
            completedAppointments: appointments.filter(a => a.status === 'completed').length,
            cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
            totalRevenue: 0,
            appointmentsByDate: {},
            revenueByService: {},
            revenueByEmployee: {},
            employeePerformance: {},
        };

        // Calculate revenue and appointments by date
        appointments.forEach(appointment => {
            if (appointment.status === 'completed') {
                const service = services.find(s => s.id === appointment.serviceId);
                if (service) {
                    stats.totalRevenue += service.price;

                    // Revenue by service
                    stats.revenueByService[appointment.serviceId] =
                        (stats.revenueByService[appointment.serviceId] || 0) + service.price;

                    // Revenue by employee
                    stats.revenueByEmployee[appointment.employeeId] =
                        (stats.revenueByEmployee[appointment.employeeId] || 0) + service.price;
                }
            }

            // Appointments by date
            stats.appointmentsByDate[appointment.date] =
                (stats.appointmentsByDate[appointment.date] || 0) + 1;
        });

        // Employee performance
        const employeeIds = [...new Set(appointments.map(a => a.employeeId))];
        employeeIds.forEach(employeeId => {
            const employeeAppointments = appointments.filter(a => a.employeeId === employeeId);
            const employeeRevenue = stats.revenueByEmployee[employeeId] || 0;
            const employeeReviews = reviews.filter(r => r.employeeId === employeeId);
            const avgRating = employeeReviews.length > 0
                ? employeeReviews.reduce((sum, r) => sum + r.rating, 0) / employeeReviews.length
                : 0;

            stats.employeePerformance[employeeId] = {
                appointments: employeeAppointments.length,
                revenue: employeeRevenue,
                rating: Math.round(avgRating * 10) / 10,
            };
        });

        updateStatistics(stats);
        return stats;
    };

    return {
        statistics,
        updateStatistics,
        calculateStatistics,
    };
}