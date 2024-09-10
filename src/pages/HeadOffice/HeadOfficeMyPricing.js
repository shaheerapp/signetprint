import { useEffect, useState } from 'react';
import HeadOfficeNavBar from '../../components/HeadOfficeNavBar';
import { COLORS } from '../../utils/theme';

const HeadOfficeMyPricing = () => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [user, setUser] = useState({ pricing: [] });

    const toggleExpand = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            console.log('parsed data', parsedUserData);
            setUser(parsedUserData);
        }
    }, []);


    return (
        <div className='bg-white'>
            <HeadOfficeNavBar />
            <div className='px-2 pt-6 md:px-10 lg:px-40 pb-5'>
                <div className="py-10 sm:py-20">
                    <div className='flex items-baseline justify-between'>
                        <h2 className='text-black font-bold font-35'>My Pricing</h2>
                        <a
                            href='/admin/change-my-pricing'
                            className="w-44 pt-1 pb-1 rounded-md items-center justify-center flex"
                            style={{ backgroundColor: COLORS.secondary }}
                        >
                            <p className='text-white ml-1 font-bold'>Change My Pricing</p>
                        </a>
                    </div>
                    <div className='mt-3 flex items-center justify-between'>
                        <a
                            href='/admin/dashboard'
                            className="pl-8 pr-8 pt-1 pb-1 rounded-md items-center justify-center flex"
                            style={{ backgroundColor: COLORS.secondary }}
                        >
                            <p className='text-white ml-1 font-bold'>Back</p>
                        </a>

                    </div>
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
                                {user.pricing.map((item, index) => (
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
                                        {/* <td className="py-2 px-4 relative">
                                            <div
                                                onClick={() => toggleExpand(index)}
                                                className={`w-28 relative cursor-pointer text-center text-white rounded-t-xl bg-primary font-bold text-lg ${expandedRow !== index ? 'rounded-b-xl' : ''}`}
                                                style={{ height: '30px', lineHeight: '30px' }}
                                            >
                                                <p>Edit</p>
                                                <div
                                                    className={`absolute left-0 top-0 z-50 w-full bg-primary shadow-lg rounded-b-lg overflow-hidden transition-all duration-300 ease-out ${expandedRow === index ? 'max-h-40' : 'max-h-0'
                                                        }`}
                                                    style={{ top: '100%', transition: 'max-height 0.3s ease-out' }}
                                                >
                                                    <button className="w-[90%] font-medium text-center text-white pt-1 edit-border-top text-sm">Delete Row</button>
                                                    <button className="w-[90%] font-medium text-center text-white pt-1 edit-border-top text-sm">Out of Stock</button>
                                                    <button className="w-[90%] font-medium text-center text-white pt-1 mb-2 edit-border-top edit-border-bottom text-sm">Edit Row</button>
                                                </div>
                                            </div>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeadOfficeMyPricing;
