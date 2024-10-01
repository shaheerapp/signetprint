import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {

    const handleBuyNowClick = (paystackLink) => {
        window.location.href = paystackLink;
    };
    // basic test link: https://paystack.com/pay/2o9f7vhk92

    // Plan prices in kobo (Naira) or cents for Paystack (amount should be multiplied by 100)
    const plans = [
        { name: 'Basic', price: 450, description: ['500 Print Jobs per month', 'Basic Print Jobs', 'Email Support'], link: 'https://paystack.com/pay/cagfddw61j' },
        { name: 'Standard', price: 599, description: ['Unlimited Print Jobs', 'Customizable Print Jobs', 'Email Support'], link: 'https://paystack.com/pay/nactjaak1y' },
        { name: 'Enterprise', price: 949, description: ['Unlimited Print Jobs', 'Customizable Print Jobs', 'Email Support', 'Key Metric Tracking'], link: 'https://paystack.com/pay/yzzx61yjyb' },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center py-10 " style={{ background: 'linear-gradient(270deg, #00FFDB 0%, #F7F7F7 100%)' }}>
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
                                onClick={() => handleBuyNowClick(plan.link)}
                            >
                                Buy Now
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