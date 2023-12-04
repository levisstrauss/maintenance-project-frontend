import React, {useEffect, useState} from 'react';
import {getAllMaintenanceRequests, getAllTenants} from "../../api/api";
import MaintenanceModal from "./MaintenanceModal";
import { format } from 'date-fns';



const formatDate = (dateString) => {
    return format(new Date(dateString), 'MM/dd/yyyy'); // 'PPP' for Aug 29, 2021
};

const formatTime = (dateString) => {
    return format(new Date(dateString), 'p'); // 'p' for 12:00 PM
};

const TenantSubmitRequest = () => {
    const [maintenanceRequest, setMaintenanceRequest] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [tenants, setTenants] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const response = await getAllMaintenanceRequests();
            setMaintenanceRequest(response.data);
        }
        fetchData().then(r => console.log(r));
    }, []);

    useEffect(() => {
        async function fetchTenants() {
            const response = await getAllTenants(); // replace with your actual API call
            setTenants(response.data);
        }
        fetchTenants();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
                return 'text-gray-800 bg-green-300';
            default:
                return 'text-gray-800 bg-red-300'
        }
    };
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-end mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setIsModalOpen(true);
                    }}
                >
                    Send Request
                </button>
            </div>

            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-3 border-b">Req.ID</th>
                    <th className="py-2 px-3 border-b">Apt Number</th>
                    <th className="py-2 px-3 border-b">Problem Area</th>
                    <th className="py-2 px-3 border-b">Description</th>
                    <th className="py-2 px-3 border-b">Date</th>
                    <th className="py-2 px-3 border-b">Time</th>
                    <th className="py-2 px-3 border-b">Image</th>
                    <th className="py-2 px-3 border-b">Status</th>
                </tr>
                </thead>
                <tbody>
                {maintenanceRequest.map(request => (
                    <tr key={request.id}>
                        <td className="py-2 px-3 border-b text-center">{request.id}</td>
                        <td className="py-2 px-3 border-b text-center">{request.apartmentNumber}</td>
                        <td className="py-2 px-3 border-b text-center">{request.problemArea}</td>
                        <td className="py-2 px-3 border-b text-center">{request.description}</td>
                        <td className="py-2 px-3 border-b text-center">{formatDate(request.requestDate)}</td>
                        <td className="py-2 px-3 border-b text-center">{formatTime(request.requestTime)}</td>
                        <td className="py-2 px-3 border-b text-center">
                            <img
                                src={request.image}
                                alt={request.name}
                                className="ml-2 h-12 w-12 rounded image-normal"
                                onMouseOver={e => e.currentTarget.classList.add('image-hover')}
                                onMouseOut={e => e.currentTarget.classList.remove('image-hover')}
                            />
                        </td>
                        <td className="py-2 px-3 border-b text-center">
                            <span className={`p-1.5 text-xs font-medium tracking-wider rounded-lg
                               ${getStatusClass(request.status)}`}>
                                {request.status}
                             </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isModalOpen && <MaintenanceModal tenants={tenants}  onClose={() =>  setIsModalOpen(false)} />}
        </div>
    );
}
export default TenantSubmitRequest;

