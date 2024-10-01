import { useEffect, useState } from 'react';
import HeadOfficeNavBar from '../../components/HeadOfficeNavBar'
import { getDocs, query, collection, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from './DashboardContext';


const HeadOfficePastJobs = () => {
    const [user, setUser] = useState([]);
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        // Fetch user data from local storage
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUser(parsedUserData);
        }
    }, []); // Only run once on mount

    // Fetch print requests based on user ID
    const fetchPrintRequests = async () => {
        if (user?.id) {
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
            }
        }
    };

    useEffect(() => {
        fetchPrintRequests();
    }, [user]); // Runs when `user` changes

    const handleReOpenJob = async (jobId, index) => {
        try {
            // Update the job status in Firestore
            const jobRef = doc(db, 'print_requests', jobId);
            await updateDoc(jobRef, { status: 'Received' });

            // Update the local state to reflect the change
            setJobs(prevJobs => prevJobs.map(job =>
                job.id === jobId ? { ...job, status: 'Received' } : job
            ));
        } catch (error) {
            console.error('Error updating job status:', error);
        }
    };

    const filteredJobs = jobs
        .filter(job => job.status === 'Closed')
        .sort((a, b) => {
            // Sort by `createdAt` in descending order
            if (a.createdAt < b.createdAt) return 1;
            if (a.createdAt > b.createdAt) return -1;
            return 0;
        });
    return (
        <div className='bg-white'>
            <HeadOfficeNavBar />
            <div className='px-2 pt-6 md:px-10 lg:px-40 pb-5'>
                <div className="py-10 sm:py-16">
                    <h2 className='text-black font-bold font-35'>Closed Jobs</h2>
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
                                onClick={fetchPrintRequests}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-14 mt-4">
                        {
                            filteredJobs.length > 0 ? (
                                filteredJobs.map((job, index) => (
                                    <div key={index} className={`relative p-4 rounded-3xl bg-primary`}>
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

                                        <div
                                            className='flex items-center mt-2 space-x-1'
                                        >
                                            <div className='flex flex-1 items-center justify-center'>
                                                <button
                                                    className="bg-white flex-0.5 font-18 text-black font-bold rounded-2xl pl-4 pr-4 pt-1 pb-1 text-center"
                                                    onClick={() => handleReOpenJob(job.id, index)}
                                                >
                                                    Re-open Job
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                                :
                                <div
                                    className='flex-1 items-center justify-center'
                                >
                                    <h2 className='text-black font-bold font-35'>No jobs found</h2>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeadOfficePastJobs;
