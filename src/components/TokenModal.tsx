import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TOKEN_LIST, NATIVE_TOKEN } from "../lib/constants";
import { formatNumber } from "../lib/quoteCalculator";
import useIsMobile from "../lib/useIsMobile";
import { useTokenStore } from "../store/useTokenStore";
import { fetchTokenMetadata, isValidTokenAddress } from "../lib/tokenUtils";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  color: string;
}

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenSelect: (token: Token) => void;
}

const TokenModal = ({ isOpen, onClose, onTokenSelect }: TokenModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchingToken, setIsSearchingToken] = useState(false);
  const [searchedToken, setSearchedToken] = useState<Token | null>(null);
  const isMobile = useIsMobile();
  const { userTokens, customTokens, loading, fetchUserTokens, addCustomToken } =
    useTokenStore();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isOpen && isConnected && address) {
      fetchUserTokens(address);
    }
  }, [isOpen, isConnected, address, fetchUserTokens]);

  // Combine native token with other tokens and custom tokens
  const allTokens = [NATIVE_TOKEN, ...TOKEN_LIST, ...customTokens];

  const tokenListWithBalances = allTokens.map((token) => {
    const userToken = userTokens.find((ut) => ut.address === token.address);
    return {
      ...token,
      balance: userToken ? userToken.balance : "0",
    };
  });

  const filteredTokens = tokenListWithBalances.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle address search
  useEffect(() => {
    const searchForToken = async () => {
      if (isValidTokenAddress(searchTerm)) {
        const existingToken = allTokens.find(
          (token) => token.address.toLowerCase() === searchTerm.toLowerCase()
        );

        if (existingToken) {
          setSearchedToken(null);
          setIsSearchingToken(false);
          return;
        }

        setIsSearchingToken(true);
        try {
          const tokenMetadata = await fetchTokenMetadata(searchTerm);
          setSearchedToken(tokenMetadata);
        } catch (error) {
          console.error("Error searching for token:", error);
          setSearchedToken(null);
        } finally {
          setIsSearchingToken(false);
        }
      } else {
        setSearchedToken(null);
        setIsSearchingToken(false);
      }
    };

    const timeoutId = setTimeout(searchForToken, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, allTokens]);

  const handleTokenClick = (token: Token) => {
    onTokenSelect(token);
    onClose();
  };

  const handleAddCustomToken = (token: Token) => {
    addCustomToken(token);
    handleTokenClick(token);
    setSearchedToken(null);
    setSearchTerm("");
  };

  const modalClasses = isMobile
    ? "fixed bottom-0 left-0 right-0 bg-[rgb(24,32,53)] rounded-t-2xl shadow-lg w-full max-w-2xl mx-auto z-50 border-t border-x border-[rgba(255,255,255,0.07)] max-h-[95vh] h-[500px] flex flex-col data-[state=open]:animate-slide-up data-[state=closed]:animate-slide-down"
    : "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgb(24,32,53)] rounded-2xl shadow-lg w-full max-w-md mx-4 z-50 border border-[rgba(255,255,255,0.07)] max-h-[90vh] flex flex-col";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className={modalClasses}>
          <Dialog.Title className="sr-only">Select a token</Dialog.Title>
          <div className="p-4 border-b border-[rgba(255,255,255,0.07)] flex-shrink-0">
            <input
              type="text"
              placeholder="Search tokens or paste address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-[rgb(24,32,53)] text-white placeholder:text-[rgb(152,161,192)] border border-[rgba(255,255,255,0.07)] rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(40,182,226)] focus:border-[rgb(40,182,226)] transition-colors"
              autoFocus
            />
          </div>
          <div className="px-4 pt-4 pb-2 flex-shrink-0">
            <span className="block text-[rgb(152,161,192)] text-xs font-semibold mb-2">
              Tokens
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-gray-400/30 border-t-gray-600 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="min-h-[20px]">
                  {searchedToken && (
                    <div className="mb-4">
                      <div className="px-2 py-1 mb-2">
                        <span className="block text-[rgb(152,161,192)] text-xs font-semibold">
                          Found Token
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddCustomToken(searchedToken)}
                        className="w-full flex items-center justify-between gap-3 py-3 px-2 rounded-xl hover:bg-[rgb(40,182,226)/.08] transition-colors mb-1 border border-[rgb(40,182,226)] bg-[rgb(40,182,226)/.05]"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={searchedToken.logoURI}
                            alt={searchedToken.symbol}
                            className="w-9 h-9 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM2NDc0OEIiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMV82IiB4MT0iOCIgeTE9IjAiIHgyPSI4IiB5Mj0iMTYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Y3RkFGQSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGN0ZBRkEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4KPC9zdmc+Cg==";
                            }}
                          />
                          <div className="flex flex-col items-start">
                            <span className="font-semibold text-white text-base leading-tight">
                              {searchedToken.name}
                            </span>
                            <span className="text-xs text-[rgb(152,161,192)] leading-tight">
                              {searchedToken.symbol}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[rgb(40,182,226)] text-sm font-medium">
                            Add Token
                          </span>
                        </div>
                      </button>
                    </div>
                  )}

                  {isSearchingToken && !searchedToken && (
                    <div className="flex items-center gap-3 py-3 px-2 rounded-xl mb-1">
                      <div className="w-6 h-6 border-2 border-gray-400/30 border-t-[rgb(40,182,226)] rounded-full animate-spin" />
                      <span className="text-[rgb(152,161,192)] text-sm">
                        Searching for token...
                      </span>
                    </div>
                  )}
                </div>

                {filteredTokens.map((token) => (
                  <button
                    key={token.address}
                    onClick={() => handleTokenClick(token)}
                    className="w-full flex items-center justify-between gap-3 py-3 px-2 rounded-xl hover:bg-[rgb(40,182,226)/.08] transition-colors mb-1"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-9 h-9 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM2NDc0OEIiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMV82IiB4MT0iOCIgeTE9IjAiIHgyPSI4IiB5Mj0iMTYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Y3RkFGQSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGN0ZBRkEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4KPC9zdmc+Cg==";
                        }}
                      />
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-white text-base leading-tight">
                          {token.name}
                        </span>
                        <span className="text-xs text-[rgb(152,161,192)] leading-tight">
                          {token.symbol}
                        </span>
                      </div>
                    </div>
                    <span className="text-white font-medium">
                      {formatNumber(token.balance, 4)}
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TokenModal;
