import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WagmiProvider } from "wagmi";
import './App.css';

import Layout from './components/Layout';
import { config } from "./lib/wagmi";

import AddLiquidity from "./pages/AddLiquidity";
import Bridge from "./pages/Bridge";
import Create from "./pages/Create";
import Explore from "./pages/Explore";
import Farms from './pages/Farms';
import Home from "./pages/Home";
import NotFound from './pages/NotFound';
import Pools from "./pages/Pools";
import RemoveLiquidity from "./pages/RemoveLiquidity";
import Swap from './pages/Swap';
import NFTPage from "./pages/NFTPage";
import Launchpad from "./pages/Launchpad";
import ProjectDetails from "./pages/ProjectDetails";
import Claim from "./pages/Claim";
import UserDashboard from "./pages/UserDashboard";
import Whitelist from "./pages/Whitelist";

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
                  <Route path="/mint" element={<NFTPage />} />
                  <Route path="/launchpad" element={<Launchpad />} />
                  <Route path="/launchpad/:id" element={<ProjectDetails />} />
                  <Route path="/create" element={<Create />} />
                  <Route path="/claim" element={<Claim />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/whitelist" element={<Whitelist />} />
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
