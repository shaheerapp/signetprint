import React from 'react';
import NavBar from '../components/NavBar';

const Pricing = () => {

    // Define the plans with their respective plan codes
    const plans = [
        { name: 'Basic', price: 299, description: ['Basic Print Jobs', 'Email Support'], planCode: 'PLN_ue3cdzzdt5s7ds1' },
        { name: 'Standard', price: 599, description: ['Unlimited Print Jobs', 'Customizable Print Jobs', 'Email Support'], planCode: 'PLN_ml0cxtwht9bkwws' },
        { name: 'Enterprise', price: 949, description: ['Unlimited Print Jobs', 'Customizable Print Jobs', 'Email Support', 'Key Metric Tracking'], planCode: 'PLN_mlziwjtoort71o1' },
    ];


    const subaccount = 'ACCT_y1bc6aimcpyeoop';

    const initializeTransaction = async (plan) => {
        try {
            const response = await fetch('https://api.paystack.co/transaction/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer sk_live_175c4cb1de422b556b365c7c33554ed5349d5d89` // Replace with your Paystack secret key
                },
                body: JSON.stringify({
                    email: 'customer@example.com', // Replace with actual customer email
                    amount: plan.price * 100, // Paystack requires the amount in kobo (Naira)
                    subaccount,
                    plan: plan.planCode,
                    callback_url: 'https://signet-print.web.app/verify-payment',
                })
            });

            const data = await response.json();
            if (data.status) {
                // Redirect to Paystack payment link
                window.location.href = data.data.authorization_url;
            } else {
                console.error('Transaction initialization failed:', data.message);
            }
        } catch (error) {
            console.error('Error initializing transaction:', error);
        }
    };


    const handleSignUpNowClick = (plan) => {
        initializeTransaction(plan);
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-10 " style={{ background: 'linear-gradient(270deg, #00FFDB 0%, #F7F7F7 100%)' }}>
            <NavBar />
            <div className="py-7">
            </div>
            <div className="mb-10">
                <p className="font-bold text-4xl md:text-6xl">Pricing Tiers</p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
                {plans.map((plan, index) => (
                    <div key={index} className="flex flex-col p-6 bg-white rounded-3xl w-[300px] plan-container">
                        <h2 className="font-bold text-black text-center" style={{ fontSize: '30px' }}>
                            {plan.name}
                        </h2>
                        <p className="mb-4 font-bold text-center" style={{ fontSize: '40px' }}>
                            R{plan.price}
                            <span className="font-normal" style={{ fontSize: '20px' }}> p/m</span>
                        </p>
                        <div className="flex justify-center items-center">
                            <button
                                className="block btn-main text-white px-7 py-1.5 rounded-2xl text-center"
                                onClick={() => handleSignUpNowClick(plan)}
                            >
                                Sign Up Now
                            </button>
                        </div>
                        <p className="font-medium text-black mt-8" style={{ fontSize: 24 }}>Includes:</p>
                        <ul className="list-none mb-4 text-left mt-3 plan-items">
                            {plan.description.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-12 text-center">
                <p className="text-black font-medium mb-4">First 2 months at R299 only</p>
                <a href="/" className="btn-main text-white px-14 py-1.5 rounded-2xl text-center">Back</a>
            </div>
        </div>
    );
};

export default Pricing;