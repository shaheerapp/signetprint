import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const reference = query.get('reference'); // Get the transaction reference from the URL

        if (reference) {
            verifyTransaction(reference);
        }
    }, [location]);

    const verifyTransaction = async (reference) => {
        try {
            const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer sk_live_175c4cb1de422b556b365c7c33554ed5349d5d89`, // Replace with your Paystack secret key
                },
            });

            const data = await response.json();
            if (data.status && data.data.status === 'success') {
                // Navigate to the register-print-shop page after successful verification
                navigate('/register-print-shop', { state: { paymentSuccessful: true } });
            } else {
                navigate('/pricing');
                console.error('Transaction verification failed:', data.message);
            }
        } catch (error) {
            console.error('Error verifying transaction:', error);
        }
    };

    return <div>Verifying payment...</div>; // Optional loading message
};

export default VerifyPayment;
