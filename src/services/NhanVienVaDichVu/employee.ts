export const getEmployees = () => {
    const data = localStorage.getItem("employees");
    return data ? JSON.parse(data) : [];
};

export const saveEmployees = (employees: any[]) => {
    localStorage.setItem("employees", JSON.stringify(employees));
};