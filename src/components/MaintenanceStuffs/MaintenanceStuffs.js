import React, {useEffect, useState} from 'react';
import {getAllMaintenanceRequests, updateStatus} from "../../api/api";
import {format} from "date-fns";


const formatDate = (dateString) => {
    return format(new Date(dateString), 'MM/dd/yyyy'); // 'PPP' for Aug 29, 2021
};

const formatTime = (dateString) => {
    return format(new Date(dateString), 'p'); // 'p' for 12:00 PM
};



const MaintenanceStuffs = () => {
    const [maintenanceRequest, setMaintenanceRequest] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchData() {
            const response = await getAllMaintenanceRequests();
            setMaintenanceRequest(response.data);
        }
        fetchData().then(r => console.log(r));
    }, []);

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm.trim().toLowerCase());
    };


    useEffect(() => {
        async function fetchData() {
            // Fetch the data without filters
            const response = await getAllMaintenanceRequests();
            const fetchedRequests = response.data;
            // Filter the fetched data based on the search term
            const filteredRequests = fetchedRequests.filter(request => {
                return (
                    request.apartmentNumber.toLowerCase().includes(searchTerm) ||
                    request.problemArea.toLowerCase().includes(searchTerm) ||
                    request.status.toLowerCase().includes(searchTerm)
                );
            });
            setMaintenanceRequest(filteredRequests);
        }

        fetchData();
    }, [searchTerm]);

    // Function to handle status updates
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateStatus(id, { status: newStatus });
            setMaintenanceRequest(currentRequests =>
                currentRequests.map(request => {
                    if (request.id === id) {
                        return { ...request, status: newStatus };
                    }
                    return request;
                })
            );
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-4 flex justify-between">
                <input
                    className="border p-2 rounded"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />

            </div>

            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-3 border-b">ID</th>
                    <th className="py-2 px-3 border-b">Apt Number</th>
                    <th className="py-2 px-3 border-b">Problem Area</th>
                    <th className="py-2 px-3 border-b">Description</th>
                    <th className="py-2 px-3 border-b">Date</th>
                    <th className="py-2 px-3 border-b">Time</th>
                    <th className="py-2 px-3 border-b">IMAGE</th>
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
                            <select
                                value={request.status}
                                onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                                className={`border rounded-lg w-2/2 py-1 px-2 text-sm text-gray-700 
                                           leading-tight focus:outline-none focus:shadow-outline ${
                                    request.status === 'completed' ? 'bg-green-400 cursor-not-allowed appearance-none' 
                                        : 'bg-red-300 ' +
                                        ' cursor-pointer'
                                }`}
                                disabled={request.status === 'completed'}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MaintenanceStuffs;




