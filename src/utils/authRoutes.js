// @ts-nocheck
export const getDashboardPathByRole = (role) => {
    if (role === "admin") {
        return "/admin/dashboard";
    }

    if (role === "employee") {
        return "/employee/dashboard";
    }

    return "/";
};