import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <div className="bg-[#a3d9ff] min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;