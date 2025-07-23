import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { http, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import './App.css';

import Layout from './components/Layout';

import Bridge from "./pages/Bridge";
import Explore from "./pages/Explore";
import Farms from './pages/Farms';
import Home from "./pages/Home";
import NotFound from './pages/NotFound';
import Pools from "./pages/Pools";
import Swap from './pages/Swap';
import AddLiquidity from "./pages/AddLiquidity";
import RemoveLiquidity from "./pages/RemoveLiquidity";

const config = getDefaultConfig({
  appName: "FarmrSwap",
  projectId: "8X1df9Wbcqj6A7LWG71Ra5yLYj-1eL7y",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds for DeFi data
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: { networkMode: 'offlineFirst' },
  }
});

function App() {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/swap" element={<Swap />} />
                  <Route path="/farms" element={<Farms />} />
                  <Route path="/pools" element={<Pools />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/bridge" element={<Bridge />} />
                  <Route path="/add" element={<AddLiquidity />} />
                  <Route path="/remove" element={<RemoveLiquidity />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
