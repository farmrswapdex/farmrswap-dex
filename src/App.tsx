import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WagmiProvider } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import './App.css';
import Farms from './pages/Farms';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Pools from "./pages/Pools";
import Swap from './pages/Swap';

const config = getDefaultConfig({
  appName: "FarmrSwap",
  projectId: "8X1df9Wbcqj6A7LWG71Ra5yLYj-1eL7y",
  chains: [monadTestnet],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds for DeFi data
      refetchOnWindowFocus: true,
    }
  }
});

function App() {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/farms" element={<Farms />} />
                <Route path="/pools" element={<Pools />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
