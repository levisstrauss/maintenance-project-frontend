import axios from "axios";

const api =  axios.create({
    baseURL: "http://localhost:8080",
});

// Maintenance Request API Calls
export const getAllMaintenanceRequests = () => {
    return api.get("/api/requests");
};
export const submitMaintenanceRequest = (requestData) => {
    return api.post("/api/requests", requestData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
export const updateStatus = (id, statusData) => {
    return api.put(`/api/requests/${id}`, statusData);
};
export const getAllTenants = () => {
    return api.get("/api/tenants");
};
export const getTenantById = (id) => {
    return api.get(`/api/tenants/${id}`);
}
export const addTenant = (tenant) => {
    return api.post("/api/tenants", tenant);
};
export const deleteTenant = (id) => {
    return api.delete(`/api/tenants/${id}`);
};
export const moveTenant = (id, tenant) => {
    return api.put(`/api/tenants/${id}`, tenant);
}
export default api;
