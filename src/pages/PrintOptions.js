import { useEffect, useState } from "react";
import CustomSelector from "../components/CustomSelector";
import CustomToggleButton from "../components/CustomToggleButton";
import NavBar from "../components/NavBar";
import { COLORS } from "../utils/theme";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';
import { useLocation, useNavigate } from 'react-router-dom';




const PrintOptions = () => {
    const printTypeOptions = ["Normal", "Booklet", "Canvas", "Flyer", "Poster", "Custom"];
    const paperSizeOptions = ["A1", "A2", "A3", "A4"];
    const paperThicknessOptions = [
        "80-100 GSM: Everyday office printing",
        "120-140 GSM: Brochures, flyers, posters",
        "160-170 GSM: Brochures, high-quality flyers",
        "200-250 GSM: Document covers, business cards",
        "300+ GSM: Greeting cards, packaging",
    ];
    const [totalPrice, setTotalPrice] = useState(0);
    const [emailAddress, setEmailAddress] = useState('');
    const [printNeed, setPrintNeed] = useState('');
    const [printType, setPrintType] = useState('');
    const [paperSize, setPaperSize] = useState('');
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('');
    const [colour, setColour] = useState('');
    const [doubleSided, setDoubleSided] = useState(false);
    const [binding, setBinding] = useState(false);
    const [paperThickness, setPaperThickness] = useState('');
    const [quantity, setQuantity] = useState(1);
    const location = useLocation();
    const [storeName, setStoreName] = useState();
    const [storeID, setStoreID] = useState();
    const { printRequestId } = location.state || {};
    const [pricingData, setPricingData] = useState([]);
    const navigate = useNavigate();
    const [currentPdfIndex, setCurrentPdfIndex] = useState(0);

    useEffect(() => {
        const fetchUserByStoreID = async () => {
            if (storeID) {
                try {
                    // Reference to the users collection
                    const usersCollection = collection(db, 'users');

                    // Query to find the document with the matching storeID field
                    const q = query(usersCollection, where('id', '==', storeID));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        setPricingData(userData.pricing);
                    } else {
                        console.log('No user found with the provided storeID');
                    }
                } catch (err) {
                    console.log(err.message);
                }
            } else {
                console.log('No storeID found in local storage');
            }
        };

        fetchUserByStoreID();
    }, [storeID]);


    const calculatePrice = () => {
        if (files.length > 0 && paperSize && colour && pricingData.length > 0) {

            // Ensure the current index is within the bounds of the files array
            if (currentPdfIndex < 0 || currentPdfIndex >= files.length) {
                console.error("Invalid currentPdfIndex:", currentPdfIndex);
                return;
            }

            // Make a copy of the current file state
            const updatedFiles = [...files];

            const currentFile = updatedFiles[currentPdfIndex];
            const { pageCount } = currentFile;

            // Find the pricing item based on paperSize and color
            const pricing = pricingData.find(
                (item) => item.paperSize === paperSize && item.color === colour
            );

            if (pricing) {
                // Find the price range that matches the pageCount
                const priceRange = pricing.priceRanges.find((range) => {
                    const [minPages, maxPages] = range.pages.split('-').map((str) => {
                        return parseInt(str.replace(/\D/g, ''), 10); // Convert to number
                    });

                    // Check if pageCount falls within the range
                    return pageCount >= minPages && (maxPages ? pageCount <= maxPages : true);
                });

                if (priceRange) {
                    // Calculate the price for the current file
                    const filePrice = priceRange.price * pageCount * quantity;

                    // Update the price for the current file
                    updatedFiles[currentPdfIndex] = { ...currentFile, price: filePrice, paperSize, colour, quantity };

                    // Update the files state with the new price for the current file
                    setFiles(updatedFiles);

                    // Calculate the total price for all files
                    const totalPrice = updatedFiles.reduce((acc, file) => acc + (file.price || 0), 0);
                    setTotalPrice(totalPrice);
                } else {
                    console.error('No matching price range found for this file');
                }
            } else {
                console.error('No matching pricing data found');
            }
        } else {
            console.error('Missing data for price calculation');
        }
    };

    const updatePrice = () => {
        calculatePrice();
        setCurrentPdfIndex((prevIndex) => Math.min(prevIndex + 1, files.length - 1));
    }

    const handleDateClick = () => {
        document.getElementById('printNeed').showPicker();
    };

    const handlePrintNowBtn = () => {
        console.log(files);
        if (files.length > 0 && colour && paperSize && totalPrice) {
            // Check if any file has a price of 0
            const hasPriceGreaterThan0 = files.some(file => file.price > 0);
            console.log(hasPriceGreaterThan0);

            if (hasPriceGreaterThan0) {
                // If all prices are valid, navigate to the next page
                navigate('/print-details', {
                    state: { printRequestId, files, colour, paperSize, totalPrice }
                });
            } else {
                alert('One or more files have a price of 0. Please ensure that all prices are calculated.');
            }
        } else {
            alert('Please ensure that all the options for your print has been entered.');
        }
    }

    const handleRequestQuoteBtn = () => {
        if (printRequestId) {
            navigate('/custom-quote', { state: { printRequestId, files, status, emailAddress, printNeed, storeName } })
        } else {
            alert('Please ensure that all the options for your print has been entered.');
        }
    }


    // Calculate price whenever necessary inputs change
    useEffect(() => {
        if (totalPrice > 0) {
            calculatePrice();
        }
    }, [paperSize, colour]);

    useEffect(() => {
        calculatePrice();
    }, [quantity]);


    useEffect(() => {
        const fetchPrintRequestData = async () => {
            if (printRequestId) {
                try {
                    // Reference to the document in Firestore
                    const docRef = doc(db, 'print_requests', printRequestId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setEmailAddress(data.customer_email);
                        setPrintNeed(data.printNeed);
                        setFiles(data.files);
                        setStoreID(data.storeID);
                        setStatus(data.status);

                        // Fetch user details based on storeID
                        const userDocRef = doc(db, 'users', data.storeID);
                        const userDocSnap = await getDoc(userDocRef);

                        if (userDocSnap.exists()) {
                            const userData = userDocSnap.data();
                            setStoreName(userData.storeName);
                        } else {
                            console.error('No user found for this storeID');
                        }

                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
            }
        };

        fetchPrintRequestData();
    }, [printRequestId]);

    return (
        <div className="bg-white">
            <NavBar />
            <div className="relative isolate px-2 pt-8 md:px-10 lg:px-40 pb-5">
                <div className="py-10 sm:py-20">
                    <a
                        href='/stores'
                    >
                        <input
                            name="search"
                            type="text"
                            readOnly
                            placeholder="Search for Printing stores / Areas"
                            className="block cursor-pointer border-0 py-1.5 pl-10 pr-20 text-black placeholder:text-gray-400 sm:leading-6 search-input"
                        />
                    </a>
                </div>
                <div
                    className="flex flex-col items-center justify-center text-center h-full"
                >
                    <h2 className="font-bold mb-8 font-35">Print Options</h2>
                </div>
                <div className="flex flex-col md:flex-row">
                    {/* Column 8 */}
                    <div className="flex-1 flex-col flex" style={{ flex: 3 }}>
                        <h2 className="font-bold mb-4 font-35">{storeName}</h2>
                        <div className="bg-white upload-files-container-second mt-4 flex flex-col pb-5 h-auto">
                            <div className="p-6 pl-8 pr-8">
                                {/* Full Name Input */}
                                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mt-6 pl-1.5" style={{ marginBottom: '-5px' }}>Email</label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    value={emailAddress}
                                    onChange={(event) => setEmailAddress(event.target.value)}
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
                                    onChange={(event) => setPrintNeed(event.target.value)}
                                    onClick={handleDateClick}
                                    placeholder="Date Needed By"
                                    className="date-input block border-0 py-1.5 pl-7 pr-20 text-black placeholder:text-gray-400 sm:leading-6 w-full"
                                />
                            </div>
                        </div>
                        <div className="mt-8">
                            {
                                files.map((file, index) => (
                                    <div key={index} className="add-print-details-item-container flex items-center mt-3">
                                        {/* Details Section */}
                                        <div className="flex-1 add-print-details-item " style={{ minHeight: '3rem' }}>
                                            <div>
                                                <p
                                                    className="text-white title-txt break-words"
                                                    style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                                >
                                                    {file.name}
                                                </p>
                                                <p className="text-white" style={{ fontSize: '12px' }}>Page count: {file.pageCount}</p>
                                            </div>
                                            {/* <p className="text-white status-txt">{status}</p>
                                        <div className="cross-icon">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke={COLORS.white}
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div> */}
                                        </div>
                                        {/* Button Section */}
                                        <button
                                            className="ml-2 btn-primary h-12 text-white text-ittalic rounded-lg flex items-center justify-center px-4 py-2"
                                            onClick={() => setCurrentPdfIndex(index)}
                                        >
                                            Change Print<br />Details
                                        </button>
                                        <div
                                            className="ml-2"
                                        >
                                            {
                                                index === 0 &&
                                                <label htmlFor="price" className="block text-md font-medium text-gray-700 mb-2" style={{ marginTop: '-30px' }}>Price</label>

                                            }
                                            <div className="flex items-center price-input-container rounded-md pl-2">
                                                <span className="text-black font-semibold mr-1">R</span>
                                                <input
                                                    name="price"
                                                    id="price"
                                                    value={file.price > 0 ? file.price : 0}
                                                    disabled
                                                    type="text"
                                                    className="block border-0 py-1.5 pl-2 pr-5 text-black placeholder:text-gray-400 sm:leading-6 w-36 price-input"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }


                        </div>
                        <div className="mt-5 w-full border-t border-black"></div>
                        <div className="add-print-details-item-container flex items-center mt-3">
                            <div className="flex-1 h-11" />
                            <div
                                className="ml-2"
                            >
                                <label htmlFor="price" className="block text-md font-medium text-gray-700 mb-2">Total</label>
                                <div className="flex items-center price-input-container rounded-md pl-2">
                                    <span className="text-black font-semibold mr-1">R</span>
                                    <input
                                        name="totalPrice"
                                        type="text"
                                        id="totalPrice"
                                        value={totalPrice}
                                        disabled
                                        className="block border-0 py-1.5 pl-2 pr-5 text-black placeholder:text-gray-400 sm:leading-6 w-36 price-input"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="add-print-details-item-container flex items-center mt-5">
                            {/* Details Section */}
                            <div className="flex-1 h-11" />
                            {/* Button Section */}
                            <button
                                onClick={handleRequestQuoteBtn}
                                className="ml-2 btn-primary h-11 text-white text-ittalic rounded-full flex items-center justify-center text-center px-4 py-2"
                            >
                                Request<br />Custom Quote
                            </button>
                            <button
                                onClick={handlePrintNowBtn}
                                className="ml-2 mr-5 btn-primary h-11 text-white text-ittalic rounded-full flex items-center justify-center px-4 py-2"
                            >
                                Print Now!
                            </button>

                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center justify-center px-8">
                        <div className="h-full border-l border-black"></div>
                    </div>

                    {/* Column 4 */}
                    <div
                        className="flex-1 flex-col flex"
                    >
                        <h2 className="font-bold mb-4 font-35">Details</h2>
                        <CustomSelector label="Print Type" options={printTypeOptions} handleSaveState={setPrintType} />
                        <div className="mb-4" />
                        <CustomSelector label="Paper Size" options={paperSizeOptions} handleSaveState={setPaperSize} />
                        <div className="mb-4" />
                        <CustomToggleButton label="Colour" handleSaveState={setColour} />
                        <div className="mb-4" />
                        <CustomToggleButton label="Double Sided" handleSaveState={setDoubleSided} />
                        <div className="mb-4" />
                        <CustomToggleButton label="Binding" handleSaveState={setBinding} />
                        <div className="mb-4" />
                        <CustomSelector label="Paper Thickness" options={paperThicknessOptions} handleSaveState={setPaperThickness} />
                        <div className="mb-4" />
                        <label className="selector-label">Number of copies</label>
                        <input
                            name="quantity"
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(event) => setQuantity(event.target.value)}
                            placeholder="Number of copies"
                            className="block border-0 py-1.5 pr-5 text-black placeholder:text-gray-400 sm:leading-6 w-36 quantity-input pl-2"
                        />
                        <div className="mb-4" />
                        <button
                            onClick={updatePrice}
                            className="mr-5 btn-primary h-11 text-white text-ittalic rounded-full flex items-center justify-center px-4 py-2"
                        >
                            Update Price for PDF #{currentPdfIndex + 1}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintOptions;
