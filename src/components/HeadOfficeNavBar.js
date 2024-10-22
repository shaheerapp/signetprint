import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { IMAGES } from '../utils/images';
import { auth } from '../firebase/firebaseConfig'; // Import the auth instance
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../pages/HeadOffice/DashboardContext';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'My Pricing', href: '/admin/my-pricing' },
    { name: 'Closed Jobs', href: '/admin/closed-jobs' },
    { name: 'Logout', href: '#' }, // We'll handle logout via onClick
];

const HeadOfficeNavBar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { setIsPastJobs } = useDashboard(); // Use the context hook


    const handlePastJobsClick = () => {
        setIsPastJobs(true);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out the user
            localStorage.removeItem('user');
            navigate('/', { replace: true }); // Redirect to the home page or login page
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };



    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="flex items-center justify-between p-6 md:px-10 lg:px-40">
                <div className="flex lg:flex-1">
                    <a href="/admin/dashboard" className="-m-1.5 p-1.5 flex items-center space-x-2"
                    >
                        <img
                            alt=""
                            src={IMAGES.logo}
                            className="h-5 w-5"
                        />
                        <span className='text-2xl custom-font font-bold text-black'>Signet Print</span>
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-6 lg:flex-1 lg:justify-end">
                    {navigation.map((item) => (
                        item.name === 'Logout' ? (
                            <button
                                key={item.name}
                                onClick={handleLogout}
                                className="custom-font text-md font-bold leading-6 text-black"
                            >
                                {item.name}
                            </button>
                        ) :
                            (
                                <a key={item.name} href={item.href} className="custom-font text-md font-bold leading-6 text-black">
                                    {item.name}
                                </a>
                            )
                    ))}
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-2">
                            <img
                                alt=""
                                src={IMAGES.logo}
                                className="h-5 w-5"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    item.name === 'Logout' ? (
                                        <button
                                            key={item.name}
                                            onClick={handleLogout}
                                            className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </button>
                                    ) : item.name === 'Past Jobs' ? (
                                        <button
                                            key={item.name}
                                            onClick={handlePastJobsClick}
                                            className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </button>
                                    ) : (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
};

export default HeadOfficeNavBar;
