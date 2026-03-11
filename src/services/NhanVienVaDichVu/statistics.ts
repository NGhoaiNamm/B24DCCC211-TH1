export const getStatistics = () => {
    const data = localStorage.getItem("statistics");
    return data ? JSON.parse(data) : null;
};

export const saveStatistics = (statistics: any) => {
    localStorage.setItem("statistics", JSON.stringify(statistics));
};