export const getAppointments = () => {
    const data = localStorage.getItem("appointments");
    return data ? JSON.parse(data) : [];
};

export const saveAppointments = (appointments: any[]) => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
};