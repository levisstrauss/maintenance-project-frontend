import React, { useState, useEffect } from 'react';
import {submitMaintenanceRequest} from "../../api/api";
import { imageDB } from "../../Config";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";


const MaintenanceModal = ({ tenants, maintenance, onClose }) => {
    const [formData, setFormData] = useState({
        requestDate: new Date(), // current timestamp
        requestTime: new Date(), // current timestamp
        apartmentNumber: '',
        description: '',
        problemArea: '',
        status: 'pending', // default status
        image: '',
    });

    const [submissionMessage, setSubmissionMessage] = useState({ message: "", type: "" });

    useEffect(() => {
        // Use the correct prop here
        if (maintenance) {
            setFormData(maintenance);
        }
    }, [maintenance]);


    // For the image upload
    const handleImageChange = (e) => {
        let file = defaultImageUrl;
        if (e.target.files && e.target.files[0]) {
            file = e.target.files[0];
        }
        setFormData(prevState => ({...prevState, image: file}));
    };

    const validateTenant = (tenantId, aptNumber) => {
        return tenants.some(tenant =>
            tenant.id === tenantId && tenant.apartmentNumber === aptNumber);
    };


    // const handleSubmitRequest = async (e) => {
    //     e.preventDefault(); // Prevent the default form submission
    //
    //     // Create a JSON object from the form data
    //     const requestData = JSON.stringify({
    //         ...formData,
    //         requestDate: new Date(formData.requestDate),
    //         requestTime: new Date(formData.requestTime),
    //     });
    //
    //     try {
    //         // Make the API call with the JSON object
    //         if(validateTenant(formData.id, formData.apartmentNumber)) {
    //             await submitMaintenanceRequest(requestData);
    //             //setSubmissionMessage("Successfully submitted maintenance request")
    //             // On success
    //             setSubmissionMessage(
    //                 {
    //                     message: "Successfully submitted maintenance request",
    //                     type: "success"
    //                 });
    //             // Reset the form data to its initial state
    //             setFormData({
    //                 id: '',
    //                 requestDate: new Date(), // current timestamp
    //                 requestTime: new Date(), // current timestamp
    //                 apartmentNumber: '',
    //                 description: '',
    //                 problemArea: '',
    //                 status: 'pending', // default status
    //             });
    //
    //         }else {
    //             //setSubmissionMessage("Tenant ID or Apartment Number doesn't exist");
    //             // On failure
    //             setSubmissionMessage(
    //                 {
    //                     message: "Tenant ID or Apartment Number doesn't exist",
    //                     type: "error"
    //                 });
    //         }
    //
    //     } catch (error) {
    //         console.error("Failed to submit maintenance request:", error);
    //         // Handle the error appropriately
    //     }
    // }
    const defaultImageUrl = "https://image.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg";

    const handleSubmitRequest = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        let imageToUpload = formData.image;
        if (!imageToUpload || typeof imageToUpload === 'string') {
            imageToUpload = defaultImageUrl; // Use your default image URL
        } else {
            try {
                // If there is a file, upload it to Firebase Storage
                const imgRef = ref(imageDB, `Files/${v4()}`); // Ensure storage is initialized
                const uploadResult = await uploadBytes(imgRef, imageToUpload);
                imageToUpload = await getDownloadURL(uploadResult.ref);
            } catch (uploadError) {
                console.error("Error uploading file:", uploadError);
                return; // Exit the function if the upload fails
            }
        }

        // Prepare the request data with the image URL
        const requestData = JSON.stringify({
            ...formData,
            requestDate: new Date(formData.requestDate),
            requestTime: new Date(formData.requestTime),
            image: imageToUpload,
        });

        try {
            // Rest of your logic for submitting the request
            if(validateTenant(formData.id, formData.apartmentNumber)) {
                await submitMaintenanceRequest(requestData);
                setSubmissionMessage({
                    message: "Successfully submitted maintenance request",
                    type: "success"
                });
                // Reset form data
                setFormData({
                    id: '',
                    requestDate: new Date(),
                    requestTime: new Date(),
                    apartmentNumber: '',
                    description: '',
                    problemArea: '',
                    image: '',
                    status: 'pending',
                });
            } else {
                setSubmissionMessage({
                    message: "Tenant ID or Apartment Number doesn't exist",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Failed to submit maintenance request:", error);
        }
    };



    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center
        items-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded p-6 w-1/3">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-red-500 text-white
                    rounded-full p-2 hover:bg-red-600"
                >
                    X
                </button>

                <h2 className="mb-4 text-center"> Submit Maintenance</h2>

                <div className="modal-container">
                    {submissionMessage.message && (
                        <div className={`message-box ${
                            submissionMessage.type === "success" ? 
                                "bg-green-100 border-green-500 text-green-700" :
                                "bg-red-100 border-red-500 text-red-700"
                        } border-l-4 p-4 mb-4`}>
                            {submissionMessage.message}
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmitRequest}>

                    <label className="block text-gray-700 mb-2">Tenant Id:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        type="string"
                        placeholder="Tenant Id"
                        value={formData.id}
                        onChange={e => {
                            setFormData({...formData, id: e.target.value});
                        }}
                    />
                    <label className="block text-gray-700 mb-2">Apartment Number:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        type="number"
                        placeholder="Apartment Number"
                        value={formData.apartmentNumber}
                        onChange={e => {
                            setFormData({...formData, apartmentNumber: e.target.value});
                        }}
                    />
                    <label className="block text-gray-700 mb-2">Description:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        placeholder="Description"
                        value={formData.description}
                        onChange={e => {
                            setFormData({...formData, description: e.target.value});
                        }}
                    />
                    <label className="block text-gray-700 mb-2">Problem Area:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        placeholder="Problem Area"
                        value={formData.problemArea}
                        onChange={e => setFormData({ ...formData, problemArea: e.target.value })}
                    />
                    <label className="block text-gray-700 mb-2">Upload Image:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default  MaintenanceModal;
