import React from 'react';
import LaunchpadSidebar from './LaunchpadSidebar';

const LaunchpadLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <div className="flex">
      <LaunchpadSidebar />
      <main className="flex-grow p-5 ml-72">{children}</main>
    </div>
  );
};

export default LaunchpadLayout;
