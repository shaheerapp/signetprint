import React, { useState } from 'react';
import { IMAGES } from "../utils/images";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const StoreLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoging, setIsLoging] = useState(false);


    const handleBack = () => {
        navigate('/'); // Go back to the previous page
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoging(true); // Show loading state

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Retrieve user data from Firestore based on the uid
            const userDocRef = doc(db, 'users', user.uid); // Adjust the 'users' collection name if needed
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    id: user.uid, // Updated to user.uid
                    email: user.email,
                    address: userData.address,  // Retrieve from Firestore userData
                    storeName: userData.storeName,
                    phoneNumber: userData.phoneNumber,
                    pricing: userData.pricing
                }));

                console.log('Logged In Successfully');
                navigate('/admin/dashboard'); // Navigate to the admin dashboard
            } else {
                setError('No such user found in the database!');
                setIsLoging(false);
            }
        } catch (err) {
            // Handle specific error codes for better error messages
            if (err.code === 'auth/user-not-found') {
                setError('Email not found. Please check the email address and try again.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Incorrect password. Please try again.');
            } else {
                console.log(err.code);
                setError('Login failed. Please try again later.');
            }
        } finally {
            setIsLoging(false); // Hide loading state
        }
    };


    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8" style={{ background: 'linear-gradient(270deg, #00FFDB 0%, #F7F7F7 100%)', height: '100%' }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Logo"
                    src={IMAGES.logo}
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Login to Store
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {error && (
                    <div className="mb-4 text-red-600 text-sm font-semibold text-center">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block outline-none px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="/forgot-password" className="font-semibold text-primary hover:bg-secondary">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full outline-none px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:bg-primary sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            Login
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
                    {isLoging && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50" style={{ marginTop: 0 }}>
                            <div className="bg-white p-4 rounded-md shadow-lg">
                                <p className="text-lg font-semibold">Please wait...</p>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default StoreLogin;
