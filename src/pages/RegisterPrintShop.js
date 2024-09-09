import React, { useState } from 'react';
import { IMAGES } from '../utils/images';
import { auth, db } from '../firebase/firebaseConfig'; // import your firebase setup
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const RegisterPrintShop = () => {
    const [formData, setFormData] = useState({
        storeName: '',
        address: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setIsRegistering(true);

        // Check if store name already exists
        try {
            const storeQuery = query(collection(db, 'users'), where('storeName', '==', formData.storeName));
            const storeSnapshot = await getDocs(storeQuery);

            if (!storeSnapshot.empty) {
                alert('Store name already exists');
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            const defaultPricingTable = [
                {
                    "id": 1,
                    "paperSize": "A4",
                    "color": "B/W",
                    "priceRanges": [
                        { "pages": "1-10 pgs", "price": 2.5 },
                        { "pages": "11-50 pgs", "price": 2 },
                        { "pages": "51-250 pgs", "price": 1.8 },
                        { "pages": "251-500 pgs", "price": 1.5 },
                        { "pages": "501-1000 pgs", "price": 1.2 },
                        { "pages": "1000+ pgs", "price": 1 }
                    ]
                },
                {
                    "id": 2,
                    "paperSize": "A4",
                    "color": "Color",
                    "priceRanges": [
                        { "pages": "1-10 pgs", "price": 10 },
                        { "pages": "11-50 pgs", "price": 8 },
                        { "pages": "51-250 pgs", "price": 6.5 },
                        { "pages": "251-500 pgs", "price": 6.5 },
                        { "pages": "501-1000 pgs", "price": 6.5 },
                        { "pages": "1000+ pgs", "price": 6.5 }
                    ]
                },
                {
                    "id": 3,
                    "paperSize": "A3",
                    "color": "B/W",
                    "priceRanges": [
                        { "pages": "1-10 pgs", "price": 5 },
                        { "pages": "11-50 pgs", "price": 4 },
                        { "pages": "51-250 pgs", "price": 3 },
                        { "pages": "251-500 pgs", "price": 2.5 },
                        { "pages": "501-1000 pgs", "price": 2 },
                        { "pages": "1000+ pgs", "price": 1.8 }
                    ]
                },
                {
                    "id": 4,
                    "paperSize": "A3",
                    "color": "Color",
                    "priceRanges": [
                        { "pages": "1-10 pgs", "price": 20 },
                        { "pages": "11-50 pgs", "price": 18 },
                        { "pages": "51-250 pgs", "price": 15 },
                        { "pages": "251-500 pgs", "price": 13 },
                        { "pages": "501-1000 pgs", "price": 12 },
                        { "pages": "1000+ pgs", "price": 10 }
                    ]
                },
                {
                    "id": 5,
                    "paperSize": "A2",
                    "color": "B/W",
                    "priceRanges": [
                        { "pages": "1-10 pgs", "price": 55 },
                        { "pages": "11-50 pgs", "price": 55 },
                        { "pages": "51-250 pgs", "price": 55 },
                        { "pages": "251-500 pgs", "price": 55 },
                        { "pages": "501-1000 pgs", "price": 55 },
                        { "pages": "1000+ pgs", "price": 55 }
                    ]
                },
                {
                    "id": 6,
                    "paperSize": "A2",
                    "color": "Color",
                    "priceRanges": [
                        { "pages": "1-10 pgs", "price": 80 },
                        { "pages": "11-50 pgs", "price": 80 },
                        { "pages": "51-250 pgs", "price": 80 },
                        { "pages": "251-500 pgs", "price": 80 },
                        { "pages": "501-1000 pgs", "price": 80 },
                        { "pages": "1000+ pgs", "price": 80 }
                    ]
                },
                {
                    "id": 7,
                    "paperSize": "A1",
                    "color": "B/W",
                    "priceRanges": [
                        { "pages": "1-10 pgs", "price": 68 },
                        { "pages": "11-50 pgs", "price": 68 },
                        { "pages": "51-250 pgs", "price": 68 },
                        { "pages": "251-500 pgs", "price": 68 },
                        { "pages": "501-1000 pgs", "price": 68 },
                        { "pages": "1000+ pgs", "price": 68 }
                    ]
                },
                {
                    "id": 8,
                    "paperSize": "A1",
                    "color": "Color",
                    "priceRanges": [
                        { "pages": "1-10 pgs", "price": 135 },
                        { "pages": "11-50 pgs", "price": 135 },
                        { "pages": "51-250 pgs", "price": 135 },
                        { "pages": "251-500 pgs", "price": 135 },
                        { "pages": "501-1000 pgs", "price": 135 },
                        { "pages": "1000+ pgs", "price": 135 }
                    ]
                }
            ];


            // Save additional user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                id: user.uid,
                storeName: formData.storeName,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                pricing: defaultPricingTable
            });
            navigate('/shop-login');
        } catch (error) {
            console.error('Error registering user:', error);
            alert(error.message);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleBack = () => {
        navigate('/'); // Go back to the previous page
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8" style={{ background: 'linear-gradient(270deg, #00FFDB 0%, #F7F7F7 100%)', height: '100%' }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img alt="Logo" src={IMAGES.logo} className="mx-auto h-10 w-auto" />
                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Register Print Shop
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div>
                        <label htmlFor="storeName" className="block text-sm font-medium leading-6 text-gray-900">
                            Store Name
                        </label>
                        <div>
                            <input
                                id="storeName"
                                name="storeName"
                                type="text"
                                value={formData.storeName}
                                onChange={handleChange}
                                required
                                autoComplete="store-name"
                                className="px-2 block outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                            Address
                        </label>
                        <div>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                autoComplete="address"
                                className="px-2 block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                            Phone Number
                        </label>
                        <div>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                autoComplete="tel"
                                className="px-2 block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                className="px-2 block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                className="px-2 block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm Password
                        </label>
                        <div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="px-2 block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            Register Print Shop
                        </button>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex w-full justify-center rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-700 shadow-sm hover:bg-gray-200"
                        >
                            Back
                        </button>
                    </div>
                    {isRegistering && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50" style={{ marginTop: 0 }}>
                            <div className="bg-white p-4 rounded-md shadow-lg">
                                <p className="text-lg font-semibold">Registering your shop...</p>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegisterPrintShop;
