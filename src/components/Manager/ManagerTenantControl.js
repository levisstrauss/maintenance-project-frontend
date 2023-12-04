import React, {useEffect, useState} from 'react';
import {deleteTenant, getAllTenants} from "../../api/api";
import TenantModal from "./TenantModal";

function ManagerTenantControl() {
    const [tenant, setTenant] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTenant, setModalTenant] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const response = await getAllTenants();
            console.log(response.data)
            setTenant(response.data);
        }
        fetchData()
    }, []);

    const openModalWithTenant = (tenant) => {
        setModalTenant(tenant);
        setIsModalOpen(true);
    };

    const openModalForNewTenant = () => {
        setModalTenant(null); // Reset modalTenant to null for new tenant
        setIsModalOpen(true);
    };
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-end mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={openModalForNewTenant}
                >
                    Add Tenant
                </button>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-3 border-b">Id</th>
                    <th className="py-2 px-3 border-b">FirstName</th>
                    <th className="py-2 px-3 border-b">LastName</th>
                    <th className="py-2 px-3 border-b">Phone</th>
                    <th className="py-2 px-3 border-b">Email</th>
                    <th className="py-2 px-3 border-b">Check In</th>
                    <th className="py-2 px-3 border-b">Check Out</th>
                    <th className="py-2 px-3 border-b">Apt Number</th>
                    <th className="py-2 px-3 border-b">Action</th>
                </tr>
                </thead>
                <tbody>
                {tenant.map(tenant => (
                    <tr key={tenant.id}>
                        <td className="py-2 px-3 border-b text-center">{tenant.id}</td>
                        <td className="py-2 px-3 border-b text-center">{tenant.firstName}</td>
                        <td className="py-2 px-3 border-b text-center">{tenant.lastName}</td>
                        <td className="py-2 px-3 border-b text-center">{tenant.phoneNumber}</td>
                        <td className="py-2 px-3 border-b text-center">{tenant.email}</td>
                        <td className="py-2 px-3 border-b text-center">{tenant.checkIn}</td>
                        <td className="py-2 px-3 border-b text-center">{tenant.checkOut}</td>
                        <td className="py-2 px-3 border-b text-center">{tenant.apartmentNumber}</td>
                        <td className="py-2 px-3 border-b text-center">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                onClick={() => openModalWithTenant(tenant)}
                            >
                                Move
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={async () => {
                                    await deleteTenant(tenant.id);
                                    setTenant(prevTenants => prevTenants.filter(p => p.id !== tenant.id));
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isModalOpen &&<TenantModal
                tenant={modalTenant}
                onClose={() => setIsModalOpen(false)}
            />}
        </div>
    );
}

export default ManagerTenantControl;
