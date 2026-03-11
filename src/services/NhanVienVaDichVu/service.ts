export const getServices = () => {
    const data = localStorage.getItem("services");
    return data ? JSON.parse(data) : [];
};

export const saveServices = (services: any[]) => {
    localStorage.setItem("services", JSON.stringify(services));
};