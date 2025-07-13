import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import './App.css';
import Layout from './components/Layout';
import Bridge from "./pages/Bridge";
import Explore from "./pages/Explore";
import Farms from './pages/Farms';
import NotFound from './pages/NotFound';
import Pools from "./pages/Pools";
import Swap from './pages/Swap';

const config = getDefaultConfig({
  appName: "FarmrSwap",
  projectId: "8X1df9Wbcqj6A7LWG71Ra5yLYj-1eL7y",
  chains: [sepolia],
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
                <Route element={<Layout />}>
                  <Route path="/" element={<Swap />} />
                  <Route path="/farms" element={<Farms />} />
                  <Route path="/pools" element={<Pools />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/bridge" element={<Bridge />} />
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
