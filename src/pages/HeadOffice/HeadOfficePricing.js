import HeadOfficeNavBar from '../../components/HeadOfficeNavBar'
import { COLORS } from '../../utils/theme';

const HeadOfficePricing = () => {
    return (
        <div className='bg-white'>
            <HeadOfficeNavBar />
            <div className='px-2 pt-6 md:px-10 lg:px-40 pb-5'>
                <div className="py-10 sm:py-20">
                    <div
                        className='flex items-center justify-between'
                    >
                        <h2 className='text-black font-bold font-35'>Pricing</h2>
                        <a
                            href='/admin/new-service'
                            className="pl-2 pr-2 pt-1 pb-1 rounded-full items-center justify-center flex"
                            style={{ backgroundColor: COLORS.secondary }}
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
                                New Service
                            </p>
                        </a>
                    </div>
                    <div className='mt-5'>
                        <a
                            href=''
                        >
                            <div
                                className='pt-2 pb-2 flex-1 bg-primary pl-5 rounded-xl mt-3'
                            >
                                <p
                                    className='text-white font-bold font-20'
                                >
                                    Printing Papers
                                </p>
                            </div>
                        </a>
                        <a
                            href=''
                        >
                            <div
                                className='pt-2 pb-2 flex-1 bg-primary pl-5 rounded-xl mt-3'
                            >
                                <p
                                    className='text-white font-bold font-20'
                                >
                                    Brochures
                                </p>
                            </div>
                        </a>
                        <a
                            href=''
                        >
                            <div
                                className='pt-2 pb-2 flex-1 bg-primary pl-5 rounded-xl mt-3'
                            >
                                <p
                                    className='text-white font-bold font-20'
                                >
                                    Business Cards
                                </p>
                            </div>
                        </a>
                        <a
                            href=''
                        >
                            <div
                                className='pt-2 pb-2 flex-1 bg-primary pl-5 rounded-xl mt-3'
                            >
                                <p
                                    className='text-white font-bold font-20'
                                >
                                    Calendars
                                </p>
                            </div>
                        </a>
                        <a
                            href=''
                        >
                            <div
                                className='pt-2 pb-2 flex-1 bg-primary pl-5 rounded-xl mt-3'
                            >
                                <p
                                    className='text-white font-bold font-20'
                                >
                                    Flyers
                                </p>
                            </div>
                        </a>
                        <a
                            href=''
                        >
                            <div
                                className='pt-2 pb-2 flex-1 bg-primary pl-5 rounded-xl mt-3'
                            >
                                <p
                                    className='text-white font-bold font-20'
                                >
                                    Canvas Print Wraps
                                </p>
                            </div>
                        </a>
                        <a
                            href=''
                        >
                            <div
                                className='pt-2 pb-2 flex-1 bg-primary pl-5 rounded-xl mt-3'
                            >
                                <p
                                    className='text-white font-bold font-20'
                                >
                                    Invitations
                                </p>
                            </div>
                        </a>
                        <a
                            href=''
                        >
                            <div
                                className='pt-2 pb-2 flex-1 bg-primary pl-5 rounded-xl mt-3'
                            >
                                <p
                                    className='text-white font-bold font-20'
                                >
                                    Banners
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeadOfficePricing;