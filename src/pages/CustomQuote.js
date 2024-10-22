import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLORS } from "../utils/theme";


const CustomQuote = () => {
    const location = useLocation();
    const { printRequestId, files, status, emailAddress, printNeed, storeName } = location.state || {};
    const navigate = useNavigate();
    const [request, setRequest] = useState('');
    const [success, setSuccess] = useState(false);

    const handleBack = () => {
        window.history.back(); // Navigates back in the browser's history
    }

    const handleSendRequest = async () => {
        if (printRequestId) {
            try {
                // Reference to the document in Firestore
                const docRef = doc(db, 'print_requests', printRequestId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {

                    await updateDoc(docRef, {
                        custom_request: request,
                    });
                    setRequest('');
                    setSuccess(true);
                } else {
                    console.error('No such document!');
                }


            } catch (error) {
                console.error('Error fetching document:', error);
            }
        }
    };

    const handleDateClick = () => {
        document.getElementById('printNeed').showPicker();
    };

    return (
        <div className="bg-white">
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
                            className="block text-md lg:text-lg cursor-pointer border-0 py-1.5 pl-10 pr-20 text-black placeholder:text-gray-400 sm:leading-6 search-input"
                        />
                    </a>
                </div>
            </div>
            {/* <!-- Alert Success  --> */}
            {
                success &&
                <div
                    className="md:px-10 lg:px-40"
                >
                    <div
                        class="flex justify-between text-white shadow-inner rounded p-3 bg-green-400"
                    >
                        <p class="self-center">
                            <strong>⁠Your custom request has been noted and will be added to your print job once you complete the "Print Now" request. Next, click on "Continue to submit order.</strong>
                        </p>
                        <button
                            onClick={() => setSuccess(false)}>
                            <strong class="text-xl align-center cursor-pointer alert-del"
                            >&times;</strong>
                        </button>
                    </div>
                </div>

            }


            <div
                className="flex flex-col items-center justify-center text-center h-full"
            >
                <h2 className="font-bold font-35">Custom Quote</h2>

                <div className="min-w-full px-2 md:px-10 lg:px-40">
                    <div
                        className="bg-white mx-5 rounded-3xl custom-quote-container"
                    >
                        <div className="flex flex-col md:flex-row">
                            <div className="p-4 text-left overflow-y-auto flex-1 flex-col flex" style={{ flex: 1.5 }}>
                                <h2 className="font-bold mb-4 font-35">{storeName}</h2>
                                <div className="bg-white upload-files-container-second mt-4 flex flex-col pb-5 h-auto mr-4">
                                    <div className="p-6 pl-8 pr-8">

                                        {/* Full Name Input */}
                                        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mt-6 pl-1.5" style={{ marginBottom: '-5px' }}>Email</label>
                                        <input
                                            name="email"
                                            id="email"
                                            type="email"
                                            value={emailAddress}
                                            readOnly
                                            placeholder="Email Address"
                                            className="block border-0 py-1.5 pl-7 pr-20 text-black placeholder:text-gray-400 sm:leading-6 w-full"
                                        />
                                        {/* Print Needed By Input */}
                                        <label htmlFor="print" className="block text-xs font-medium text-gray-700 mt-6 pl-1.5" style={{ marginBottom: '-5px' }}>Date needed by</label>
                                        <input
                                            name="printNeed"
                                            id="printNeed"
                                            type="date"
                                            value={printNeed}
                                            readOnly
                                            onClick={handleDateClick}
                                            placeholder="Date Needed By"
                                            className="date-input block border-0 py-1.5 pl-7 pr-20 text-black placeholder:text-gray-400 sm:leading-6 w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    {
                                        files.map((file, index) => (
                                            <div
                                                className="flex items-center mt-3"
                                                style={{ width: '100%' }}
                                            >
                                                <div
                                                    className="bg-primary flex items-center justify-between flex-1 rounded-2xl mr-5 pl-5 pr-5"
                                                >
                                                    <p
                                                        className="flex font-bold font-20 items-center text-left h-14 text-white "
                                                    >
                                                        {file.name}
                                                    </p>
                                                    <p
                                                        className="font-bold font-15 text-white text-ittalic"
                                                    >
                                                        {status}
                                                    </p>

                                                </div>
                                            </div>

                                        ))
                                    }
                                </div>

                            </div>

                            <div className="p-4 flex-1 flex-col flex">
                                <p className="text-xl font-medium mb-4 text-left">
                                    Request
                                </p>
                                <textarea
                                    className="request-textarea rounded-2xl"
                                    value={request}
                                    onChange={(event) => setRequest(event.target.value)}
                                ></textarea>
                                <button
                                    onClick={handleSendRequest}
                                    className="mt-3 btn-primary h-11 w-[150px] text-white font-bold rounded-full flex items-center justify-center px-4 py-2"
                                >
                                    Send Request
                                </button>
                            </div>

                        </div>
                        <button
                            onClick={handleBack}
                            className="pay-online-btn rounded-md mt-10"
                        >
                            ⁠Continue to submit your order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomQuote;