import { useEffect, useState } from 'react';
import HeadOfficeNavBar from '../../components/HeadOfficeNavBar'
import { getDocs, query, collection, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const [user, setUser] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from local storage
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUser(parsedUserData);
        }
    }, []); // Only run once on mount

    useEffect(() => {
        // Fetch print requests based on user ID
        const fetchPrintRequests = async () => {
            if (user?.id) {
                setLoading(true);
                try {
                    // Reference to the print_requests collection
                    const q = query(
                        collection(db, 'print_requests'),
                        where('storeID', '==', user.id)
                    );
                    const querySnapshot = await getDocs(q);

                    // Map the query results to an array of job objects
                    const fetchedJobs = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setJobs(fetchedJobs);
                } catch (error) {
                    console.error('Error fetching print requests:', error);
                } finally {
                    setLoading(false); // Stop loading after fetch is complete
                }
            }
        };

        fetchPrintRequests();
    }, [user]); // Runs when `user` changes

    const handleJobClosed = async (jobId, index) => {
        try {
            // Update the job status in Firestore
            const jobRef = doc(db, 'print_requests', jobId);
            await updateDoc(jobRef, { status: 'Closed' });

            // Update the local state to reflect the change
            setJobs(prevJobs => prevJobs.map(job =>
                job.id === jobId ? { ...job, status: 'Closed' } : job
            ));
        } catch (error) {
            console.error('Error updating job status:', error);
        }
    };

    const handlePrintJob = (jobId) => {
        navigate('/admin/print-details', { state: { jobId } });
    };

    const filteredJobs = jobs
        .filter(job => job.status === 'Received')
        .sort((a, b) => {
            // Sort by `createdAt` in descending order
            if (a.createdAt < b.createdAt) return 1;
            if (a.createdAt > b.createdAt) return -1;
            return 0;
        });

    // useEffect(() => {
    //     const handleDeleteAll = async () => {
    //         try {
    //             const q = query(
    //                 collection(db, 'print_requests'),
    //                 where('storeID', '==', user.id)
    //             );
    //             const querySnapshot = await getDocs(q);

    //             // Loop through and delete each document
    //             const deletePromises = querySnapshot.docs.map((doc) =>
    //                 deleteDoc(doc.ref)
    //             );

    //             // Wait for all delete operations to finish
    //             await Promise.all(deletePromises);

    //             // Clear the local jobs state after deletion
    //             setJobs([]);

    //             console.log('All print requests deleted successfully');
    //         } catch (error) {
    //             console.error('Error deleting print requests:', error);
    //         }
    //     };
    //     handleDeleteAll();
    // }, [])

    return (
        <div className='bg-white min-h-screen'>
            <HeadOfficeNavBar />
            <div className='px-2 pt-6 md:px-10 lg:px-40 pb-5 min-h-screen flex flex-col'>
                <div className="py-10 sm:py-16 flex-1 flex flex-col">
                    <h2 className='text-black font-bold font-35'>Dashboard</h2>
                    <div className='mt-4 flex items-center space-x-6'>
                        <h2 className='text-black font-medium font-20'>New Jobs</h2>
                        <div
                            className='flex items-center space-x-2'
                        >
                            <button
                                className='sort-by pt-1 pb-1 pl-4 pr-4 rounded-md'
                            >
                                Sort By
                            </button>
                            <button
                                className='sort-by pt-1 pb-1 pl-4 pr-4 rounded-md'
                                onClick={() => window.location.reload()}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        // Display loading spinner/message while fetching jobs
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                            <div className="bg-white p-4 rounded-md shadow-lg">
                                <p className="text-lg font-semibold">Loading...</p>
                            </div>
                        </div>
                    ) :
                        filteredJobs.length > 0 ? (
                            <div className="grid grid-cols-3 gap-14 mt-4">
                                {
                                    filteredJobs.map((job, index) => (
                                        <div key={index} className={`relative p-4 rounded-3xl bg-primary`}>
                                            {job.custom_request &&
                                                <div
                                                    style={{ top: -20, right: -5, fontSize: 12 }}
                                                    className='absolute bg-white shadow-2xl rounded-full pl-2 flex items-center justify-center text-black w-14 h-14'
                                                >
                                                    <p>Custom Quote</p>
                                                </div>
                                            }
                                            <p className="font-25 text-white font-bold">{job.files[0].name}</p>
                                            <div className='horizontal-divider' />
                                            <div className='flex items-center mt-2 space-x-1'>
                                                <p className="font-18 text-white font-medium">Email Address:</p>
                                                <p className="font-18 text-white font-bold">{job.customer_email}</p>
                                            </div>
                                            <div className='flex items-center mt-2 space-x-1'>
                                                <p className="font-18 text-white font-medium">Needed by:</p>
                                                <p className="font-18 text-white font-bold">{job.printNeed}</p>
                                            </div>
                                            <div className='flex items-center mt-2 space-x-1'>
                                                <p className="font-18 text-white font-medium">Status:</p>
                                                <p className="font-18 text-white font-bold">{job.status}</p>
                                            </div>
                                            <div className='flex items-center mt-2 space-x-1'>
                                                <p className="font-18 text-white font-medium">Cost:</p>
                                                <p className="font-18 text-white font-bold">R {job.totalPrice}</p>
                                            </div>
                                            <div className='flex items-center mt-2 space-x-1'>
                                                <p className="font-18 text-white font-medium">Payment Reference:</p>
                                                <p className="font-18 text-white font-bold">{job.paymentReference ? job.paymentReference + " (Online)" : "Pay In Store"}</p>
                                            </div>
                                            <div className='flex items-center mt-2 space-x-1'>

                                                <button
                                                    onClick={() => handlePrintJob(job.id)}
                                                    className="font-18 bg-white text-black font-bold rounded-2xl pl-4 pr-4 pt-1 pb-1 flex-1 text-center mr-4"
                                                >
                                                    Print Job
                                                </button>
                                                <button
                                                    onClick={() => handleJobClosed(job.id, index)}
                                                    className="font-18 bg-white text-black font-bold rounded-2xl pl-4 pr-4 pt-1 pb-1 flex-1 text-center"
                                                >
                                                    Close Job
                                                </button>

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                            :
                            <div className='flex-1 flex items-center justify-center'>
                                <h2 className='text-black font-bold font-35'>No jobs found</h2>
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default Dashboard;
