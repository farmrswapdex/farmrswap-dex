import * as Dialog from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import type { FC } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: FC<SearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <Dialog.Content className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#18181b] rounded-2xl shadow-lg p-0 w-full max-w-xl transform transition-all animate-fade-in-down border border-[#23232b] z-50">
          <div className="flex justify-between items-center px-6 pt-6 pb-2 border-b border-[#23232b]">
            <Dialog.Title className="text-lg font-semibold text-white">Search tokens and pools</Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-white text-2xl px-2">&times;</Dialog.Close>
          </div>
          <div className="relative px-6 pt-4 pb-2">
            <input
              type="text"
              placeholder="Search tokens and pools"
              className="w-full pl-12 pr-12 py-3 rounded-full bg-[#23232b] border border-[#35353f] text-white text-lg focus:outline-none focus:ring-2 focus:ring-red-400 placeholder:text-gray-400"
              autoFocus
            />
            <Search className="absolute left-9 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <span className="absolute right-9 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-[#23232b] border border-[#35353f] text-gray-400 text-sm font-mono select-none">/</span>
          </div>
          <div className="px-6 pb-6">
            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-400 mb-2">Recent Searches</h3>
              <div className="text-gray-500">No recent searches</div>
            </div>
            <div className="mt-4 border-t border-[#23232b] pt-4">
              <h3 className="text-base font-semibold text-gray-400 mb-2">Tokens by 24h Volume</h3>
              <div className="text-gray-500">Token volume data loading...</div>
            </div>
            <div className="mt-4 border-t border-[#23232b] pt-4">
              <h3 className="text-base font-semibold text-gray-400 mb-2">Pools</h3>
              <div className="text-gray-500">Pools data loading...</div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SearchModal;