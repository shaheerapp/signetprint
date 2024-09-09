import { useEffect, useState } from 'react';
import HeadOfficeNavBar from '../../components/HeadOfficeNavBar';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const HeadOfficeChangeMyPricing = () => {
    const [request, setRequest] = useState(`Here is the example CSV as exported from Excel for the default store pricing. You may edit it to suit your store, else explain your store pricing thoroughly:
Paper Size,Color,Page Range,Price
A4,B/W,1-10 pgs,2.5
A4,B/W,11-50 pgs,2
A4,B/W,51-250 pgs,1.8
A4,B/W,251-500 pgs,1.5
A4,B/W,501-1000 pgs,1.2
A4,B/W,1000+ pgs,1
A4,Color,1-10 pgs,10
A4,Color,11-50 pgs,8
A4,Color,51-250 pgs,6.5
A4,Color,251-500 pgs,6.5
A4,Color,501-1000 pgs,6.5
A4,Color,1000+ pgs,6.5
A3,B/W,1-10 pgs,5
A3,B/W,11-50 pgs,4
A3,B/W,51-250 pgs,3
A3,B/W,251-500 pgs,2.5
A3,B/W,501-1000 pgs,2
A3,B/W,1000+ pgs,1.8
A3,Color,1-10 pgs,20
A3,Color,11-50 pgs,18
A3,Color,51-250 pgs,15
A3,Color,251-500 pgs,13
A3,Color,501-1000 pgs,12
A3,Color,1000+ pgs,10
A2,B/W,1-10 pgs,55
A2,B/W,11-50 pgs,55
A2,B/W,51-250 pgs,55
A2,B/W,251-500 pgs,55
A2,B/W,501-1000 pgs,55
A2,B/W,1000+ pgs,55
A2,Color,1-10 pgs,80
A2,Color,11-50 pgs,80
A2,Color,51-250 pgs,80
A2,Color,251-500 pgs,80
A2,Color,501-1000 pgs,80
A2,Color,1000+ pgs,80
A1,B/W,1-10 pgs,68
A1,B/W,11-50 pgs,68
A1,B/W,51-250 pgs,68
A1,B/W,251-500 pgs,68
A1,B/W,501-1000 pgs,68
A1,B/W,1000+ pgs,68
A1,Color,1-10 pgs,135
A1,Color,11-50 pgs,135
A1,Color,51-250 pgs,135
A1,Color,251-500 pgs,135
A1,Color,501-1000 pgs,135
A1,Color,1000+ pgs,135`);
    const [user, setUser] = useState([]);
    const navigate = useNavigate();
    const [isSubmited, setIsSubmited] = useState(false);


    useEffect(() => {
        // Fetch user data from local storage
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUser(parsedUserData);
        }
    }, []); // Only run once on mount


    const handleSendRequest = async () => {
        try {
            if (!request.trim()) {
                alert("Please fill in your pricing request.");
                return;
            }

            // Assuming `user` contains store name (e.g., user.storeName)
            const storeName = user?.storeName || "Unknown Store"; // Fallback if user is not logged in

            // Create the change request document
            await addDoc(collection(db, "change_requests"), {
                storeName: storeName,
                request: request,
                createdAt: serverTimestamp(), // Use Firestore server timestamp for current date
            });

            setIsSubmited(true);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to submit the request. Please try again.");
            setIsSubmited(false);
        }
    };

    return (
        <div className='bg-white'>
            <HeadOfficeNavBar />
            <div className='px-2 pt-6 md:px-10 lg:px-40 pb-5'>
                <div className="py-10 sm:py-16 ml-3 mr-3">
                    <h2 className='text-black font-bold font-35'>Change My Pricing</h2>
                    <p className='text-black font-medium'>You are welcome to submit a change to your store pricing by typing in the text field below. After explaining the new pricing thoroughly, click the "Submit Pricing Change Request" and we will update your pricing within 3 business days.</p>
                </div>
                <div
                    className=''
                >
                    <div className="flex-1 flex-col flex ml-3 mr-3">
                        <p className="text-xl font-medium mb-4 text-left">
                            Pricing Change Request
                        </p>
                        <textarea
                            className="request-textarea rounded-2xl"
                            value={request}
                            onChange={(event) => setRequest(event.target.value)}
                        ></textarea>
                        <div
                            className='flex items-center space-x-3'>
                            <button
                                onClick={handleSendRequest}
                                className="mt-3 btn-primary h-11 w-[300px] text-white font-bold rounded-full flex items-center justify-center px-4 py-2"
                            >
                                Submit Pricing Change Request
                            </button>
                            <a
                                href='/admin/my-pricing'
                                className="mt-3 bg-gray-200 h-11 w-[120px] text-gray-700 shadow-sm hover:bg-gray-300 font-bold rounded-full flex items-center justify-center px-4 py-2"
                            >
                                Cancel
                            </a>
                        </div>

                    </div>

                </div>
            </div>
            {isSubmited && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50" style={{ marginTop: 0 }}>
                    <div className="bg-white p-4 rounded-md shadow-lg">
                        <p className="text-lg font-semibold">Request submitted successfully.</p>
                        <div
                            className='mt-8 flex items-center justify-center'
                        >
                            <a
                                href='/admin/dashboard'
                                className="pay-online-btn rounded-md"
                            >
                                Return to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeadOfficeChangeMyPricing;
