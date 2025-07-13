import { EyeOff, Inbox } from "lucide-react";
import Footer from "../components/Footer";

const Pools = () => {
    return (
        <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col justify-between">
            {/* Header Section */}
            <div className="flex flex-col w-full max-w-4xl mx-auto pt-16 pb-8 px-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2d3e3e] tracking-wide" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                            Positions
                        </h1>
                        <span className="ml-2 bg-[#f6f6f6] text-[#2d3e3e] text-xs font-semibold px-3 py-1 rounded-full shadow border border-gray-200 select-none">V1</span>
                    </div>
                    <button className="bg-blue-200 hover:bg-blue-300 text-[#2d3e3e] font-semibold px-6 py-2 rounded-full shadow transition text-lg">
                        + New Position
                    </button>
                </div>
                {/* Positions Row */}
                <div className="flex items-center justify-between w-full mb-8">
                    <div className="text-xl text-[#2d3e3e] font-medium">Your positions (0)</div>
                    <span className="text-blue-500 text-lg cursor-pointer flex items-center gap-1 hover:underline select-none">
                        <EyeOff />
                        Hide closed positions
                    </span>
                </div>
            </div>

            {/* Empty State Card */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-2xl bg-[#f6f6f6] rounded-2xl shadow-md flex flex-col items-center justify-center p-12 min-h-[260px]">
                    <div className="mb-6">
                        <Inbox size={50} />
                    </div>
                    <div className="text-lg text-[#2d3e3e] mb-2 text-center">Your active liquidity positions will appear here.</div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Pools