import HeadOfficeNavBar from '../../components/HeadOfficeNavBar'
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';


const HeadOfficePrintDetails = () => {
    const location = useLocation();
    const [job, setJob] = useState({});
    const navigate = useNavigate();
    const { jobId } = location.state || {};

    useEffect(() => {
        const fetchPrintRequestData = async () => {
            if (jobId) {
                try {
                    const docRef = doc(db, 'print_requests', jobId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setJob(data);
                        console.log(data); // Log the data here
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
            }
        };

        fetchPrintRequestData();
    }, [jobId]);



    const handleJobCompleteClick = async () => {
        if (job) {
            try {
                // Reference to the document in Firestore
                const docRef = doc(db, 'print_requests', job.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {

                    await updateDoc(docRef, {
                        status: 'Completed'
                    });
                    navigate('/admin/dashboard');

                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        }

    }


    return (
        <div className='bg-white'>
            <HeadOfficeNavBar />
            <div className='px-2 pt-6 md:px-10 lg:px-40 pb-5'>
                <div className="py-30 sm:py-28">
                    <div
                        className="flex flex-col items-center justify-center text-center h-full"
                    >
                        <h2 className="font-bold font-35">Print Details</h2>

                        <div className="min-w-full px-2 pt-1 md:px-10 lg:px-40">
                            <div
                                className="bg-white table-main-container mx-5 rounded-3xl"
                            >
                                {/* Table */}
                                <table className="min-w-full bg-white text-left rounded-3xl">
                                    <thead>
                                        <tr className="table-header-b">
                                            <th className="py-2 px-4 w-1/1">Product</th>
                                            <th className="py-2 px-4 w-1/6">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {job.files?.length > 0 ? (
                                            job.files.map((file, index) => (
                                                <tr key={index}>
                                                    <td className="py-2 px-4">
                                                        <div className="flex items-center justify-center space-x-3">
                                                            <p className="bg-grey text-lg flex-1 pr-4 pl-4 overflow-hidden">{file.name}</p>
                                                            <p className="bg-grey text-sm flex-1">{file.paperSize}, {file.colour}, {file.quantity} Copies</p>
                                                            <a
                                                                href={file.url}
                                                                download={file.name}
                                                                target="_blank"
                                                                className="download-fles-btn rounded-xl cursor-pointer"
                                                                style={{ flex: 0.3 }}
                                                                rel="noreferrer"
                                                            >
                                                                Download Files
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-4">R {file.price}</td>
                                                </tr>
                                            ))
                                        ) : null}


                                    </tbody>
                                </table>
                                <div
                                    className="table-footer-t mt-5 mb-5 flex justify-end mr-10 pt-5"
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
                                            onClick={handleJobCompleteClick}
                                            className="pay-online-btn rounded-md mt-2"
                                        >
                                            Job Completed
                                        </button>
                                    </div>
                                    <div
                                        className="mr-5 "
                                    >
                                        <p
                                            className="text-left total-txt"
                                        >
                                            R {job.totalPrice}
                                        </p>
                                    </div>
                                </div>
                                {job.custom_request &&
                                    <div className='text-md font-medium text-black mt-5 mb-5 ml-5 mr-5 text-left'
                                    >
                                        <p className='font-bold'>Custom Quote:</p>
                                        <p>{job.custom_request}</p>

                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default HeadOfficePrintDetails