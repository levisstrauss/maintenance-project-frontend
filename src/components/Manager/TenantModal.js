import React, {useEffect, useState} from 'react';
import { moveTenant, addTenant } from "../../api/api";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {format} from "date-fns";

const initialFormState = {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    checkIn: '',
    checkOut: '',
    apartmentNumber: ''
};

const TenantModal = ({ tenant, onClose }) => {
    // const [formData, setFormData] = useState({
    //     id: '',
    //     firstName: '',
    //     lastName: '',
    //     phoneNumber: '',
    //     email: '',
    //     checkIn: '',
    //     checkOut: '',
    //     apartmentNumber: ''
    // });
    const [formData, setFormData] = useState(initialFormState);
    // Effect to pre-fill form when the modal opens with a tenant's data
    useEffect(() => {
        if (tenant) {
            setFormData({
                id: tenant.id || '',
                firstName: tenant.firstName || '',
                lastName: tenant.lastName || '',
                phoneNumber: tenant.phoneNumber || '',
                email: tenant.email || '',
                checkIn: tenant.checkIn || '',
                checkOut: tenant.checkOut || '',
                apartmentNumber: tenant.apartmentNumber || ''
            });
        }else{
            setFormData(initialFormState);
        }
    }, [tenant]);

    const handleCancel = () => {
        setFormData(initialFormState); // Reset form data
        onClose(); // Close the modal
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // If tenant has an id, we're updating; otherwise, we're adding
            if (tenant && tenant.id) {
                await moveTenant(tenant.id, formData);
            } else{
                await addTenant(formData);
            }
            onClose(); // Close the modal upon successful submission
        } catch (error) {
            console.error("Failed to submit tenant:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleDateChange = (field, date) => {
        const formattedDate = format(date, 'MM/dd/yyyy');
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: formattedDate
        }));
    };

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" />
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white
                rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                    <h2 className="mb-4 text-center">(Add || Move) Tenant</h2>
                                </h3>
                                <div className="mt-2">
                                    <button
                                        onClick={handleCancel}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                    >
                                        X
                                    </button>
                                    <form onSubmit={handleSubmit}>
                                        {/* Name */}
                                        <label className="block text-sm font-medium text-gray-700">ID</label>
                                        <input
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm
                                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            type="text"
                                            name="id"
                                            value={formData.id}
                                            onChange={handleInputChange}
                                        />
                                        <label className="block text-sm font-medium text-gray-700">First name</label>
                                        <input
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm
                                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                        />
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm
                                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                        />
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm
                                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                        />
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm
                                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            type="text"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        <label className="block text-sm font-medium text-gray-700">Check In Date</label>
                                        <DatePicker
                                            selected={formData.checkIn ? new Date(formData.checkIn) : null}
                                            onChange={(date) => handleDateChange('checkIn', date)}
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm
                                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <label className="block text-sm font-medium text-gray-700">Check Out Date</label>
                                        <DatePicker
                                            selected={formData.checkOut ? new Date(formData.checkOut) : null}
                                            onChange={(date) => handleDateChange('checkOut', date)}
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm
                                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <label className="block text-sm font-medium text-gray-700">Apt Number</label>
                                        <input
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm
                                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            type="text"
                                            name="apartmentNumber"
                                            value={formData.apartmentNumber}
                                            onChange={handleInputChange}
                                        />
                                        {/* Submit Button */}
                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center w-full px-4 py-2 text-base
                                                font-medium text-white bg-blue-600 border border-transparent rounded-md
                                                shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2
                                                focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantModal;
