import React, { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import NavBar from "../components/NavBar";
import { COLORS } from "../utils/theme";
import { db, storage } from '../firebase/firebaseConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import { Helmet } from 'react-helmet';


const words = ["Priced...", "Printed...", "Paid..."];
const typingSpeed = 200;
const erasingSpeed = 100;
const delayBetweenWords = 2000;

const Home = () => {
    const [fileList, setFileList] = useState([]);
    const [fileUrls, setFileUrls] = useState([]);
    const [emailAddress, setEmailAddress] = useState('');
    const [printNeed, setPrintNeed] = useState('');
    const [storeID, setStoreID] = useState('');
    const [selectedOption, setSelectedOption] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [stores, setStores] = useState([]);
    const location = useLocation();
    const { selectedUser } = location.state || {};
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        const handleTyping = () => {
            const word = words[currentWordIndex];
            if (isDeleting) {
                setCurrentText(prev => prev.slice(0, prev.length - 1));
                if (currentText === '') {
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }
            } else {
                setCurrentText(word.slice(0, currentText.length + 1));
                if (currentText === word) {
                    setIsDeleting(true);
                    setTimeout(() => setCursorVisible(false), delayBetweenWords - 200);
                }
            }
        };

        const typingInterval = setInterval(handleTyping, isDeleting ? erasingSpeed : typingSpeed);
        const cursorBlinkInterval = setInterval(() => {
            setCursorVisible(prev => !prev);
        }, 500);

        return () => {
            clearInterval(typingInterval);
            clearInterval(cursorBlinkInterval);
        };
    }, [currentText, isDeleting, currentWordIndex]);


    useEffect(() => {
        const fetchStores = async () => {
            try {
                const storesCollection = collection(db, "users");
                const storesSnapshot = await getDocs(storesCollection);
                const storesList = storesSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id // Add this line to get the document ID
                }));
                setStores(storesList);
                if (selectedUser) {
                    const selectedStore = storesList.find(store => store.storeName === selectedUser);
                    if (selectedStore) {
                        setSelectedOption(selectedUser);
                        setStoreID(selectedStore.id);
                    }
                }
            } catch (error) {
                console.error("Error fetching stores: ", error);
            }
        };

        fetchStores();
    }, []);

    // Function to extract page count from the PDF
    const getPdfPageCount = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        return pdfDoc.getPageCount();
    };

    const uploadFiles = async (files) => {
        const uploadPromises = files.map(async (fileData) => {
            const { file, pageCount } = fileData; // fileData includes both file and pageCount
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.error('File upload error:', error);
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve({
                            name: file.name,
                            url: downloadURL,
                            type: file.type,
                            pageCount: pageCount // Ensure pageCount is included here
                        });
                    }
                );
            });
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        setFileUrls(uploadedFiles);
    };

    const handleFileInput = async (event) => {
        setIsUploading(true);
        const files = event.target.files;
        const validFileTypes = ['application/pdf'];

        const selectedFiles = await Promise.all(
            Array.from(files)
                .filter(file => validFileTypes.includes(file.type))
                .map(async (file) => {
                    const pageCount = await getPdfPageCount(file);
                    return { file, pageCount }; // Return both file and pageCount
                })
        );

        setFileList(selectedFiles); // Now fileList includes both file and pageCount
        await uploadFiles(selectedFiles);
        setIsUploading(false);
    };

    const handleDateClick = () => {
        document.getElementById('printNeed').showPicker();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionClick = (storeName) => {
        const selectedStore = stores.find(store => store.storeName === storeName);
        if (selectedStore) {
            setSelectedOption(storeName);
            setStoreID(selectedStore.id); // Set the store ID
            setIsDropdownOpen(false);
        }
    };


    const handleRemoveFile = (index) => {
        setFileList(prevFileList => prevFileList.filter((_, i) => i !== index));
        setFileUrls(prevFileUrls => prevFileUrls.filter((_, i) => i !== index));
    };

    const handlePrintNow = async () => {
        if (fileUrls.length > 0 && emailAddress && printNeed && storeID && selectedOption) {
            try {
                const docRef = await addDoc(collection(db, 'print_requests'), {
                    files: fileUrls,
                    customer_email: emailAddress,
                    printNeed: printNeed,
                    storeID: storeID,
                    createdAt: new Date(),
                    status: 'Pending',
                });

                const documentId = docRef.id;

                await updateDoc(doc(db, 'print_requests', documentId), {
                    id: documentId,
                });

                navigate('/print-options', { state: { printRequestId: documentId } });
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            alert('Please ensure you have (1) selected a store, (2) uploaded a PDF, (3) entered your email and (4) chosen a delivery date.');
        }
    };



    return (
        <div className="bg-white">
            <Helmet>
                <meta name="description" content="Get the best of all the printing shops." />
                <meta property="og:title" content="Signet Print" />
                <meta property="og:description" content="Get the best of all the printing shops." />
                <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/print-hub-4es1ey.appspot.com/o/logo.png?alt=media&token=92d286d0-0d07-4956-b145-c60c8e7e759b" />
                <meta property="og:url" content="https://print-hub-4es1ey.web.app/" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            <NavBar />
            <div className="relative isolate px-2 pt-8 md:px-10 lg:px-40 pb-5" style={{ background: 'linear-gradient(270deg, #00FFDB 0%, #F7F7F7 100%)' }}>
                <div className="py-10 sm:py-20">
                    <a href='/stores'>
                        <input
                            name="search"
                            type="text"
                            readOnly
                            placeholder="Search for Printing stores / Areas"
                            className="block cursor-pointer border-0 py-1.5 pl-10 pr-20 text-black placeholder:text-gray-400 sm:leading-6 search-input w-full max-w-full mx-auto"
                        />
                    </a>
                </div>
                <div className="py-10 sm:py-8 sm:px-5 mb-5 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4" style={{ background: COLORS.white70, borderRadius: 23 }}>
                    <div className='flex-1 flex-col flex'>
                        <div className="bg-white upload-files-container mt-4 flex flex-col pb-5 px-4 md:px-8 overflow-x-auto">
                            <div className="flex-1 p-2 overflow-y-auto custom-scroll relative overflow-x-hidden">
                                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mt-6 pl-1.5">Email</label>
                                <input
                                    name="email"
                                    id='email'
                                    type={'email'}
                                    placeholder="Email Address"
                                    value={emailAddress}
                                    onChange={(event) => setEmailAddress(event.target.value)}
                                    className="block border-0 py-1.5 bg-white pl-7 pr-20 text-black placeholder:text-gray-400 sm:leading-6 w-full"
                                />
                                <label htmlFor="dateNeededBy" className="block text-xs font-medium text-gray-700 mt-6 pl-1.5">Date Needed By</label>
                                <input
                                    name="printNeed"
                                    id="dateNeededBy"
                                    type="date"
                                    value={printNeed}
                                    onChange={(event) => setPrintNeed(event.target.value)}
                                    style={{ minHeight: '40px' }}
                                    className="mt-2 date-input bg-white block border-0 py-1 pl-7 pr-20 text-black placeholder:text-gray-400 sm:leading-6 w-full"
                                />

                                <div className="flex items-center space-x-3 cursor-pointer mt-6" onClick={toggleDropdown}>
                                    <div className="plus-icon rounded-full items-center justify-center flex" style={{ backgroundColor: COLORS.secondary }}>
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth={3} stroke={COLORS.white} className="size-8">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path d="M10 7L15 12L10 17" stroke={COLORS.white} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </g>
                                        </svg>
                                    </div>
                                    <span className="text-xl custom-font font-normal text-black" style={{ fontSize: 26 }}>
                                        {selectedOption || "Select Print Shop"}
                                    </span>
                                </div>
                                {isDropdownOpen && (
                                    <div className="mt-2 bg-white rounded-xl shadow-lg p-4 max-h-40 overflow-y-auto w-full max-w-xs">
                                        {stores.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleOptionClick(item.storeName)}
                                                className="cursor-pointer p-2 hover:bg-gray-200"
                                            >
                                                {item.storeName}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center space-x-3 cursor-pointer mt-6" onClick={() => document.getElementById('fileInput').click()}>
                                    <div className="plus-icon rounded-full items-center justify-center flex" style={{ backgroundColor: COLORS.secondary }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke={COLORS.white} className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                    <span className="text-2xl custom-font font-normal text-black" style={{ fontSize: 26 }}>
                                        Upload Files
                                    </span>
                                </div>
                                <div className="mt-8">
                                    {fileList.map((file, index) => (
                                        <div key={index} className="print-details-item mt-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-white">{file.file.name}</p>
                                                <p className="text-white" style={{ fontSize: '12px' }}>Page count: {file.pageCount}</p>
                                            </div>
                                            <div className="cross-icon cursor-pointer" onClick={() => handleRemoveFile(index)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={COLORS.white} className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    multiple
                                    accept="application/pdf"
                                    onChange={handleFileInput}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <div className="pt-4 flex justify-center" style={{ borderTop: '2px solid #DFDDDD' }}>
                                <button
                                    onClick={handlePrintNow}
                                    className="text-white px-8 py-2 rounded-full btn-secondary"
                                >
                                    Print Now
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 flex-col flex mt-5 sm:mt-0' style={{ flex: 1.5 }}>
                        <p className="font-semibold text-black" style={{ fontSize: 38 }}>
                            Hassle Free Printing.
                        </p>
                        <div className="typing-effect font-bold text-black" style={{ fontSize: 66 }}>
                            <span id="typing">{currentText}</span>
                            <span className={`cursor ${cursorVisible ? '' : 'hidden'}`}></span>
                        </div>
                    </div>
                </div>
            </div>
            {isUploading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50" style={{ marginTop: 0 }}>
                    <div className="bg-white p-4 rounded-md shadow-lg">
                        {/* Circular Progress Spinner */}
                        <div className="spinner"></div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Home;
