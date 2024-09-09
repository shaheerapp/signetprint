// Pricing.js
const Pricing = () => {
    return (
        <div className="bg-white flex flex-col items-center py-10">
            <div className="mb-10">
                <p className="font-bold text-4xl md:text-6xl">
                    Pricing Tiers
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
                {/* Plan 1 */}
                <div className="flex flex-col p-6 bg-white rounded-3xl w-[300px] plan-container">
                    <h2
                        className="font-bold text-black text-center"
                        style={{ fontSize: '30px' }}
                    >
                        Basic
                    </h2>
                    <p
                        className="mb-4 font-bold text-center"
                        style={{ fontSize: '40px' }}
                    >
                        R450
                        <span
                            className="font-normal"
                            style={{ fontSize: '20px' }}
                        >
                            p/m
                        </span>
                    </p>
                    <div
                        className="flex justify-center items-center"
                    >
                        <a
                            href="/register-print-shop"
                            className="btn-main text-white px-7 py-1.5 rounded-2xl text-center"
                        >Buy Now</a>
                    </div>

                    <p
                        className="font-medium text-black mt-8"
                        style={{ fontSize: 24 }}
                    >
                        Includes:
                    </p>
                    <ul
                        className="list-none mb-4 text-left mt-3 plan-items"
                    >
                        <li>500 Print Jobs per month</li>
                        <li>Basic Print Jobs</li>
                        <li>Email Support</li>
                    </ul>

                </div>

                {/* Plan 2 */}
                <div className="flex flex-col p-6 bg-white rounded-3xl w-[300px] plan-container">
                    <h2
                        className="font-bold text-black text-center"
                        style={{ fontSize: '30px' }}
                    >
                        Standard
                    </h2>
                    <p
                        className="mb-4 font-bold text-center"
                        style={{ fontSize: '40px' }}
                    >
                        R599
                        <span
                            className="font-normal ml-2"
                            style={{ fontSize: '20px' }}
                        >
                            p/m
                        </span>
                    </p>
                    <div
                        className="flex justify-center items-center"
                    >
                        <a
                            href="/register-print-shop"
                            className="btn-main text-white px-7 py-1.5 rounded-2xl text-center"
                        >Buy Now</a>
                    </div>

                    <p
                        className="font-medium text-black mt-8"
                        style={{ fontSize: 24 }}
                    >
                        Includes:
                    </p>
                    <ul
                        className="list-none mb-4 text-left mt-3 plan-items"
                    >
                        <li>Unlimited Print Jobs</li>
                        <li>Customizable Print Jobs</li>
                        <li>Email Support</li>
                    </ul>

                </div>

                {/* Plan 3 */}
                <div className="flex flex-col p-6 bg-white rounded-3xl w-[300px] plan-container">
                    <h2
                        className="font-bold text-black text-center"
                        style={{ fontSize: '30px' }}
                    >
                        Enterprise
                    </h2>

                    <p
                        className="mb-4 font-bold text-center"
                        style={{ fontSize: '40px' }}
                    >
                        R949
                        <span
                            className="font-normal"
                            style={{ fontSize: '20px' }}
                        >
                            p/m
                        </span>
                    </p>
                    <div
                        className="flex justify-center items-center "
                    >
                        <a
                            href="/register-print-shop"
                            className="btn-main text-white px-7 py-1.5 rounded-2xl text-center"
                        >Buy Now</a>
                    </div>

                    <p
                        className="font-medium text-black mt-8"
                        style={{ fontSize: 24 }}
                    >
                        Includes:
                    </p>
                    <ul
                        className="list-none mb-4 text-left mt-3 plan-items"
                    >
                        <li>Unlimited Print Jobs</li>
                        <li>Customizable Print Jobs</li>
                        <li>Email Support</li>
                        <li>Key Metric Tracking</li>

                    </ul>
                </div>
            </div>
            <div
                className="mt-12 text-center"
            >
                <p className="text-black font-medium mb-4">First 2 months at R299 only</p>
                <a href="/"
                    className="btn-main text-white px-14 py-1.5 rounded-2xl text-center"
                >
                    Back</a>
            </div>
        </div>
    );
}

export default Pricing;
