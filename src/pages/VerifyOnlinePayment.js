import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";


const VerifyOnlinePayment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const reference = query.get('reference'); // Get the transaction reference from the URL
        const printRequestId = query.get("printRequestId");

        if (reference) {
            verifyTransaction(reference, printRequestId);
        }
    }, [location]);

    const verifyTransaction = async (reference, printRequestId) => {
        try {
            const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer sk_test_6387dfc884da169e373d841492096eaa2ed84b2f`, // Replace with your Paystack secret key
                },
            });

            const data = await response.json();
            if (data.status && data.data.status === 'success') {
                updatePaymentStatus(reference, printRequestId);
                localStorage.setItem('paymentSuccess', 'true'); // Set as a string
                navigate('/');
            } else {
                navigate('/');
                console.error('Transaction verification failed:', data.message);
            }
        } catch (error) {
            console.error('Error verifying transaction:', error);
        }
    };

    const updatePaymentStatus = async (paymentReference, printRequestId) => {
        if (printRequestId) {
            const docRef = doc(db, 'print_requests', printRequestId);
            await updateDoc(docRef, {
                status: 'Received',
                paymentReference: paymentReference // Use the reference from payment
            });
        }
    };

    return <div>Verifying payment...</div>; // Optional loading message
};

export default VerifyOnlinePayment;
