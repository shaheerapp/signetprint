import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { COLORS } from "../utils/theme";


const CompareShops = () => {
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const getAllStores = async () => {
        try {
            const usersCollection = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => doc.data());
            setStores(usersList);
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    }

    useEffect(() => {
        getAllStores();
    }, []);

    useEffect(() => {
        const fetchStores = () => {
            if (stores.length > 0) {
                const firstStore = stores[0];
                setSelectedStore(firstStore); // Set the first store
            }
        };
        fetchStores();
    }, [stores]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionClick = (storeName) => {
        const selectedStore = stores.find(store => store.storeName === storeName);
        if (selectedStore) {
            setSelectedStore(selectedStore);
            setIsDropdownOpen(false);
        }
    };

    return (
        <div>
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
            <div className='px-2 md:px-5 lg:px-40 pb-5'>
                <div>
                    <div
                        className='flex items-center justify-between'
                    >
                        <h2 className='text-black font-bold font-35'>Compare Shops</h2>
                    </div>
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
                            {selectedStore ? selectedStore.storeName : "Select Print Shop"}
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
                    <div className='mt-5'>
                        {/* Table */}
                        <table className="min-w-full bg-white text-left">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 w-1/5">Paper Size</th>
                                    <th className="py-2 px-4 w-1/7">Color</th>
                                    <th className="py-2 px-4 w-1/7">1-10 pgs</th>
                                    <th className="py-2 px-4 w-1/7">11-50 pgs</th>
                                    <th className="py-2 px-4 w-1/7">51-250 pgs</th>
                                    <th className="py-2 px-4 w-1/7">251-500 pgs</th>
                                    <th className="py-2 px-4 w-1/7">501-1000 pgs</th>
                                    <th className="py-2 px-4 w-1/7">1000+ pgs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedStore && selectedStore.pricing && selectedStore.pricing.map((item, index) => (
                                    <tr key={index} className='table-header-b'>
                                        <td className="py-2 px-4">
                                            <div
                                                className="w-36 flex items-center justify-center rounded-xl pl-3 pr-3"
                                                style={{ backgroundColor: '#D9D9D9' }}
                                            >
                                                <p className="text-lg flex-1 mr-4 text-center">
                                                    {item.paperSize}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">{item.color}</td>
                                        {item.priceRanges.map((range, rangeIndex) => (
                                            <td key={rangeIndex} className="py-2 px-4">
                                                {range.price}
                                            </td>
                                        ))}

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompareShops;