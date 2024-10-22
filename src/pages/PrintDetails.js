import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLORS } from "../utils/theme";


const PrintDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { printRequestId, files, totalPrice, emailAddress, subAccountCode } = location.state || {};
    const [isSubmited, setIsSubmited] = useState('');

    const handleBack = () => {
        window.history.back(); // Navigates back in the browser's history
    }

    const handleReturn = () => {
        navigate('/')
    }

    const handlePayClick = async () => {
        if (printRequestId) {
            try {
                // Reference to the document in Firestore
                const docRef = doc(db, 'print_requests', printRequestId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {

                    await updateDoc(docRef, {
                        files: files,
                        totalPrice: totalPrice,
                        status: 'Received'
                    });
                    setIsSubmited('store')

                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        }

    }


    const handlePayOnlineClick = async () => {
        try {
            if (printRequestId) {
                // Reference to the document in Firestore
                const docRef = doc(db, 'print_requests', printRequestId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {

                    await updateDoc(docRef, {
                        files: files,
                        totalPrice: totalPrice,
                    });

                } else {
                    console.error('No such document!');
                }
                const response = await fetch('https://api.paystack.co/transaction/initialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer sk_test_6387dfc884da169e373d841492096eaa2ed84b2f`
                    },
                    body: JSON.stringify({
                        email: emailAddress,     // Customer email
                        amount: totalPrice * 100, // Amount in Kobo (ZAR * 100)
                        subaccount: subAccountCode,
                        currency: 'ZAR',
                        callback_url: `https://signet-print.web.app/verify-online-payment?printRequestId=${printRequestId}`,
                    })
                });

                const data = await response.json();
                if (data.status) {
                    // Redirect to Paystack payment link
                    window.location.href = data.data.authorization_url;
                } else {
                    console.error('Transaction initialization failed:', data.message);
                }
            }
        } catch (error) {
            console.error('Error initializing transaction:', error);
        }

    };



    return (
        <div className="bg-white min-h-screen">
            <NavBar />
            <div className="relative isolate px-2 pt-8 md:px-10 lg:px-40">
                <div className="py-12 sm:py-20">
                    <a
                        href='/stores'
                    >
                        <input
                            name="search"
                            type="text"
                            readOnly
                            placeholder="Search for Printing stores / Areas"
                            className="block cursor-pointer text-md lg:text-lg border-0 py-1.5 pl-10 pr-20 text-black placeholder:text-gray-400 sm:leading-6 search-input"
                        />
                    </a>
                </div>
            </div>
            <div
                className="flex-col items-center justify-center text-center h-full"
            >
                <h2 className="font-bold mb-8 font-35">Print Details</h2>

                <div className="min-w-full px-2 pt-1 md:px-10 lg:px-40">
                    <div
                        className="bg-white table-main-container mx-5 rounded-3xl overflow-x-auto"
                    >
                        {/* Table */}
                        <table className="min-w-full bg-white text-left rounded-3xl">
                            <thead>
                                <tr className="table-header-b">
                                    <th className="py-2 px-4 w-1/2">Product</th>
                                    <th className="py-2 px-4 w-1/5">Quantity</th>
                                    <th className="py-2 px-4 w-1/5">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    files.map((file, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4">
                                                <div
                                                    className="flex items-center justify-center">
                                                    <p
                                                        className="bg-grey text-lg flex-1 mr-4 truncate"
                                                    >
                                                        {file.name}
                                                    </p>
                                                    <p
                                                        className="bg-grey text-sm flex-1.5"
                                                        style={{ letterSpacing: '2px' }}
                                                    >
                                                        {file.paperSize}, {file.colour}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">{file.quantity} Copies</td>
                                            <td className="py-2 px-4">R {file.price}</td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>

                        <div
                            className="table-footer-t mt-5 mb-5 flex items-center justify-end mr-10 pt-5 ml-5"
                        >
                            <div
                                className="mr-5 "
                            >
                                <p
                                    className="text-left total-txt"
                                >
                                    Total:
                                </p>
                                <button
                                    onClick={handlePayOnlineClick}
                                    className="pay-online-btn rounded-md mt-2"
                                    style={{ backgroundColor: 'grey' }}
                                >
                                    Pay Online
                                </button>
                            </div>
                            <div
                                className="mr-5 "
                            >
                                <p
                                    className="text-left total-txt"
                                >
                                    R {totalPrice}
                                </p>
                                <button
                                    onClick={handlePayClick}
                                    className="pay-online-btn rounded-md mt-2"
                                >
                                    Submit order and pay in-store
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
                <button
                    onClick={handleBack}
                    className="pay-online-btn rounded-md mt-10"
                >
                    Go Back
                </button>
            </div>
            {isSubmited && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 p-4">
                    <div className="bg-white p-4 rounded-md shadow-lg w-full sm:max-w-md lg:max-w-5xl text-center mx-auto">
                        <div className="cross-icon flex justify-end">
                            <span onClick={() => setIsSubmited('')} className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={COLORS.black} className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </span>
                        </div>
                        {isSubmited === 'store' ? (
                            <p className="text-lg font-medium">
                                Thank you for your order! <br />
                                We've received your PDF, email, and desired pickup date. Please remember to bring your payment with you when you come to pick up your order.
                            </p>
                        ) : (
                            <p className="text-lg font-medium">
                                Thank you for your order! <br />
                                We've received your PDF, email, and desired pickup date. You may come collect your order on the given pickup date.
                            </p>
                        )}

                        <button onClick={handleReturn} className="pay-online-btn rounded-md mt-10">
                            Return to Home
                        </button>
                    </div>
                </div>

            )}
        </div>
    )
}

export default PrintDetails;