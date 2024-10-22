import { useState } from "react";
import NavBar from "../components/NavBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const MyPrintingJobs = () => {
    const [search, setSearch] = useState('');
    const [printJobs, setPrintJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleShowJobClick = async () => {
        if (search) {
            setLoading(true);
            try {
                const q = query(collection(db, "print_requests"), where("customer_email", "==", search));
                const querySnapshot = await getDocs(q);

                const jobs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setPrintJobs(jobs); // Update the state with fetched jobs
            } catch (error) {
                console.error("Error fetching print jobs: ", error);
                alert("An error occurred while fetching print jobs.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleJobClick = (documentId) => {
        // Navigate to the next page with the document ID in the state
        navigate('/print-options', { state: { printRequestId: documentId } });
    }

    return (
        <div className="bg-white">
            <NavBar />
            <div className="relative isolate px-2 pt-8 md:px-10 lg:px-40 sm:py-30">
                <div className="py-12 sm:py-20 flex">
                    <input
                        name="search"
                        type="email"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Enter Email for Printing Resquest"
                        className="block border-0 text-md lg:text-lg py-1.5 pl-10 pr-20 text-black placeholder:text-gray-400 sm:leading-6 search-input"
                    />
                    <button
                        onClick={handleShowJobClick}
                        type="button"
                        className="min-w-32 md:min-w-32 lg:min-w-48 ml-4 justify-center rounded-full bg-primary px-2 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        Show Print Jobs
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center h-full mb-10">
                <h2 className="font-bold mb-8 text-2xl md:text-3xl lg:text-4xl">My Printing Jobs</h2>

                {printJobs.length > 0 ? (
                    printJobs.map(job => (
                        <div className="w-full flex items-center px-4 pt-1 mb-4 md:px-8 lg:px-20">
                            <div className="flex items-center justify-between w-full flex-nowrap">
                                <div className="bg-primary flex items-center justify-between flex-1 rounded-2xl pl-5 pr-5 min-h-14 md:min-h-14 w-full">
                                    <p className="font-bold text-lg md:text-xl lg:text-2xl text-left text-white flex items-center w-full">
                                        {job.files[0].name}
                                        <span className="mx-2">:</span>
                                        <span className="font-medium">{job.printNeed}</span>
                                    </p>
                                    <p className="font-bold text-lg md:text-xl lg:text-2xl text-white ml-4">
                                        {job.totalPrice || 0}
                                    </p>
                                </div>
                                {job.status === 'Pending' ? (
                                    <button
                                        onClick={() => handleJobClick(job.id)}
                                        className="flex font-medium text-sm md:text-lg rounded-2xl items-center justify-center bg-primary h-10 md:h-14 text-white px-4 ml-4 hover:bg-secondary cursor-pointer"
                                    >
                                        {job.status}
                                    </button>
                                ) : (
                                    <p className="flex font-medium text-sm md:text-lg rounded-2xl items-center justify-center bg-primary h-10 md:h-14 text-white px-4 ml-4">
                                        {job.status}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="mt-5 text-sm md:text-lg">No print jobs found for the given email.</p>
                )}
            </div>



            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50" style={{ marginTop: 0 }}>
                    <div className="bg-white p-4 rounded-md shadow-lg">
                        {/* Circular Progress Spinner */}
                        <div className="spinner"></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyPrintingJobs;

