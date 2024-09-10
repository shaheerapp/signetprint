import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import L from "leaflet"; // Import Leaflet library


const Stores = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate(); // Initialize navigate


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => doc.data());
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, []);

    // Initialize Leaflet map
    useEffect(() => {
        let map; // Declare the map variable

        // Check if map is already initialized, to prevent reinitialization
        if (!map) {
            map = L.map('map').setView([-33.9321, 18.8602], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([-33.9321, 18.8602]).addTo(map)
                .bindPopup('The Office Crew')
                .openPopup();
        }

        // Cleanup function to remove the map instance when the component unmounts
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, []); // Ensure this effect only runs once when the component mounts


    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handlePrintNow = (user) => {
        navigate('/', { state: { selectedUser: user.storeName } });
    };

    const filteredUsers = users.filter(user =>
        user.storeName.toLowerCase().includes(searchQuery) ||
        user.address.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="bg-white">
            <NavBar />
            <div className="relative isolate px-2 pt-8 md:px-10 lg:px-40">
                <div className="py-10 sm:py-10">
                    <input
                        name="search"
                        type="text"
                        id="search"
                        placeholder="Search for Printing stores / Areas"
                        className="block border-0 py-1.5 pl-10 pr-20 text-black placeholder:text-gray-400 sm:leading-6 search-input-second"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="flex flex-col h-full px-2 md:px-10 lg:px-40">
                <h2 className="font-bold font-35 text-left ml-8">Stores</h2>
                <p className="text-left ml-8 mb-8 font-medium"
                >
                    The following stores are available on Signet Print. Click on "Print Now" to submit your print job to your desired store.
                </p>

                {filteredUsers.map((user, index) => (
                    <div className="min-w-full flex items-center px-8 mt-3" key={index}>
                        <div className="flex items-center justify-between w-full">
                            <div className="border-primary flex flex-col items-center flex-1 rounded-2xl mr-5 pt-1 pb-1 pl-5 pr-5 bg-white">
                                <div className="flex items-center w-full">
                                    <p className="font-bold text-20 text-left mr-2">
                                        {user.storeName}
                                    </p>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-primary">★</span>
                                        <span className="text-primary">★</span>
                                        <span className="text-primary">★</span>
                                        <span className="text-gray-400">★</span>
                                        <span className="text-gray-400">★</span>
                                    </div>
                                </div>

                                <div className="flex items-center w-full space-x-2">
                                    <p className="text-left text-gray-400 font-medium">
                                        {user.address}
                                    </p>
                                    <div className="h-full border-r border-gray-400 mx-4" style={{ height: '1rem' }}></div>
                                    <p className="text-left text-gray-400 font-medium">
                                        {user.phoneNumber}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="flex font-medium font-18 rounded-2xl items-center justify-center bg-primary h-14 text-white pt-1 pb-1 pl-5 pr-5"
                                style={{ flex: 0.1 }}
                                onClick={() => handlePrintNow(user)}
                            >
                                Print Now!
                            </button>
                        </div>
                    </div>
                ))}

                <div className="mt-5 mb-8 ml-8 mr-8">
                    {/* Leaflet Map */}
                    <div id="map" style={{ height: "300px" }}></div>
                </div>

            </div>
        </div>
    )
}

export default Stores;
