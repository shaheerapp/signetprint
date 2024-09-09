import { useState } from "react"
import HeadOfficeNavBar from "../../components/HeadOfficeNavBar"
import { COLORS } from "../../utils/theme";
import CustomMultiSelector from "../../components/CustomMultiSelector";

const NewService = () => {
    const [isActive, setIsActive] = useState('type');
    const paperSizeOptions = ["A1", "A2", "A3", "A4", "Custom"];
    const paperThicknessOptions = ["1mm", "2mm", "3mm", "4mm", "5mm", "Custom"];

    return (
        <div className='bg-white'>
            <HeadOfficeNavBar />
            <div className='px-2 pt-6 md:px-10 lg:px-40 pb-5'>
                <div className="py-10 sm:py-20">
                    <h2 className='text-black font-bold font-35'>New Service</h2>
                    <div className="mt-5 bg-primary pl-12 pr-12 rounded-2xl pt-3 pb-4" >
                        <h2 className='text-white font-bold font-35 text-center'>New Service</h2>
                        <div className="mt-4">
                            {
                                isActive === 'type' ? (
                                    <>
                                        <p className='text-white font-bold font-25'>Service Type</p>
                                        <input
                                            className="bg-white pt-3 pb-3 w-full pl-4 pr-4 service-type-input rounded-2xl"
                                        />
                                    </>
                                )
                                    :
                                    isActive === 'paper' ?
                                        <>
                                            <CustomMultiSelector label={'Paper Sizes'} options={paperSizeOptions} />
                                            <CustomMultiSelector label={'Paper Thickness'} options={paperThicknessOptions} />
                                            <div
                                                className="flex justify-end mt-4"
                                            >
                                                <button
                                                    onClick={() => setIsActive('variable')}
                                                    className="pl-2 pr-2 pt-2 pb-2 rounded-full items-center justify-center flex"
                                                    style={{ backgroundColor: '#007463' }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={3}
                                                        stroke={COLORS.white}
                                                        className="size-5"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                    <p
                                                        className='text-white ml-1 font-bold'
                                                    >
                                                        New Variable
                                                    </p>
                                                </button>
                                            </div>
                                        </>
                                        :
                                        isActive === 'variable' ?
                                            <>
                                                <p className='text-white font-bold font-25'>Variable Type</p>
                                                <input
                                                    className="bg-white pt-3 pb-3 w-full pl-4 pr-4 service-type-input rounded-2xl"
                                                />
                                            </>
                                            :
                                            null



                            }

                        </div>
                        <div
                            className="mt-8 mb-5 text-center"
                        >
                            {
                                isActive === 'type' ? (
                                    <button
                                        onClick={() => setIsActive('paper')}
                                        className="bg-white text-primary pl-4 pr-4 pt-2 pb-2 rounded-2xl font-bold font-18"
                                    >
                                        Continue
                                    </button>
                                )
                                    :
                                    isActive === 'paper' ? (
                                        <a
                                            href="/admin/add-pricing"
                                            className="bg-white text-primary pl-4 pr-4 pt-2 pb-2 rounded-2xl font-bold font-18"
                                        >
                                            Add Pricing
                                        </a>
                                    )
                                        :
                                        isActive === 'variable' ? (
                                            <button
                                                onClick={() => setIsActive('type')}
                                                className="bg-white text-primary pl-4 pr-4 pt-2 pb-2 rounded-2xl font-bold font-18"
                                            >
                                                Continue
                                            </button>
                                        )
                                            : null
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewService