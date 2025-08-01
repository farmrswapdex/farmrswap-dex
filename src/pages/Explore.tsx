import { BarChart2, ExternalLink, LineChart, Search } from "lucide-react";
import { TOKEN_LIST, NATIVE_TOKEN } from "../lib/constants";

const Explore = () => {
  // Combine native token with other tokens
  const allTokens = [NATIVE_TOKEN, ...TOKEN_LIST];

  return (
    <div className="w-full min-h-screen bg-[#a7d8f5] flex flex-col justify-between">
      <div className="w-full max-w-7xl mx-auto pt-16 pb-8 px-4 flex flex-col gap-10">
        {/* Header and Stats */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Left: Title and Stats */}
          <div className="flex-1 min-w-[320px]">
            <h1
              className="text-4xl md:text-5xl font-extrabold text-[#2d3e3e] tracking-wide mb-2"
              style={{ fontFamily: "Fredoka One, sans-serif" }}
            >
              FarmrSwap Stats
            </h1>
            <div className="flex items-center gap-2 text-[#888] text-base mb-6">
              Powered by The Graph
              <LineChart size={18} className="inline-block text-[#b0c4d4]" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-[#f6f6f6] rounded-2xl shadow p-6 flex flex-col gap-2 w-full max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#2d3e3e]">
                    Total Value Locked
                  </span>
                  <button className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-[#2d3e3e] hover:bg-gray-100 transition">
                    <BarChart2 size={16} /> Chart <ExternalLink size={14} />
                  </button>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[#2d3e3e]">
                  $1,949,145.83
                </div>
                <div className="text-[#b0c4d4] text-sm">Jul 13, 2025</div>
              </div>
              <div className="bg-[#f6f6f6] rounded-2xl shadow p-6 flex flex-col gap-2 w-full max-w-xs">
                <span className="font-semibold text-[#2d3e3e]">
                  Cumulative Volume
                </span>
                <div className="text-3xl md:text-4xl font-bold text-[#2d3e3e]">
                  $16,387,387.03
                </div>
                <div className="text-[#b0c4d4] text-sm">All time</div>
              </div>
            </div>
          </div>
          {/* Right: Chart and Volume */}
          <div className="flex-1 flex flex-col items-end min-w-[320px]">
            <div className="flex items-center justify-between w-full mb-2">
              <div>
                <div className="text-[#2d3e3e] font-semibold text-lg">
                  FarmrSwap Volume
                </div>
                <div className="text-3xl font-bold text-[#2d3e3e]">
                  $1,702,918.14
                </div>
                <div className="text-[#b0c4d4] text-sm">Past month</div>
              </div>
              <div className="flex gap-1 bg-blue-100 rounded-full p-1">
                <button className="px-3 py-1 rounded-full text-xs font-semibold text-[#2d3e3e] bg-white shadow transition">
                  D
                </button>
                <button className="px-3 py-1 rounded-full text-xs font-semibold text-[#2d3e3e] bg-blue-200">
                  W
                </button>
                <button className="px-3 py-1 rounded-full text-xs font-semibold text-[#2d3e3e] bg-blue-200">
                  M
                </button>
              </div>
            </div>
            {/* Chart Placeholder */}
            <div className="w-full h-40 bg-yellow-100 rounded-xl flex items-end gap-2 px-4 py-2 mt-2">
              {/* Fake bars for placeholder */}
              {[
                8, 7, 6, 7, 5, 4, 6, 8, 10, 12, 8, 7, 6, 9, 14, 11, 7, 5, 4, 8,
              ].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div
                    className="bg-yellow-300 rounded-t-md"
                    style={{ height: `${h * 8}px` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between w-full text-xs text-[#b0c4d4] mt-2 px-2">
              <span>Jun 18</span>
              <span>Jun 23</span>
              <span>Jun 28</span>
              <span>Jul 03</span>
              <span>Jul 08</span>
              <span>Jul 13</span>
            </div>
          </div>
        </div>

        {/* Tabs, Chain Selector, Search */}
        <div className="flex items-center gap-8 mt-8 mb-2">
          <div className="flex gap-6 text-2xl font-bold">
            <span className="text-[#2d3e3e] border-b-4 border-[#2d3e3e] pb-1">
              Tokens
            </span>
            <span className="text-[#b0c4d4] font-semibold pb-1 cursor-pointer">
              Pools
            </span>
          </div>
          <div className="flex-1 flex items-center justify-end gap-4">
            <div className="bg-[#f6f6f6] rounded-full p-2 shadow border border-gray-200 flex items-center">
              <Search className="text-[#b0c4d4] w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Token Table */}
        <div className="w-full bg-[#f6f6f6] rounded-2xl shadow p-0 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-[#b0c4d4] text-sm font-semibold">
                <th className="py-4 px-6">#</th>
                <th className="py-4 px-6">Token name</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">1 hour</th>
                <th className="py-4 px-6">1 day</th>
                <th className="py-4 px-6">FDV</th>
                <th className="py-4 px-6">Volume (24H)</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="text-[#2d3e3e] text-base">
              {allTokens.map((token, i) => {
                // NOTE: The following data is mocked for display purposes.
                const mockData = {
                  price: `${(Math.random() * 200).toFixed(2)}`,
                  h1: `${Math.random() > 0.5 ? "+" : "-"}${(
                    Math.random() * 3
                  ).toFixed(2)}%`,
                  d1: `${Math.random() > 0.5 ? "+" : "-"}${(
                    Math.random() * 15
                  ).toFixed(2)}%`,
                  fdv: `${Math.floor(Math.random() * 1000)}M`,
                  vol: `${Math.floor(Math.random() * 1000)}K`,
                };

                return (
                  <tr
                    key={token.address}
                    className="border-t border-gray-200 hover:bg-white/60 transition"
                  >
                    <td className="py-4 px-6 font-semibold">{i + 1}</td>
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={token.logoURI}
                        alt={token.name}
                        className="w-8 h-8 rounded-full border border-gray-200"
                      />
                      <div>
                        <div className="font-bold">{token.symbol}</div>
                        <div className="text-xs text-[#b0c4d4]">
                          {token.name}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{mockData.price}</td>
                    <td
                      className={`py-4 px-6 font-semibold ${
                        mockData.h1.startsWith("+")
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {mockData.h1}
                    </td>
                    <td
                      className={`py-4 px-6 font-semibold ${
                        mockData.d1.startsWith("+")
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {mockData.d1}
                    </td>
                    <td className="py-4 px-6">{mockData.fdv}</td>
                    <td className="py-4 px-6">{mockData.vol}</td>
                    <td className="py-4 px-6 flex gap-2 items-center">
                      <button className="bg-blue-100 hover:bg-blue-200 rounded-full p-2">
                        <ExternalLink size={18} className="text-blue-500" />
                      </button>
                      <button className="bg-blue-100 hover:bg-blue-200 rounded-full p-2">
                        <BarChart2 size={18} className="text-blue-500" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Explore;
