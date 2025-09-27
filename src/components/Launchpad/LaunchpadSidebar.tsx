import { NavLink } from 'react-router-dom';

const LaunchpadSidebar = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean; }) =>
    `block py-2.5 px-4 rounded transition duration-200 ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-700'
    }`;

  return (
    <div className="fixed top-24 left-4 w-64 bg-gray-800/50 backdrop-blur-lg text-white rounded-lg shadow-xl h-fit">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Launchpad</h2>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/launchpad" end className={navLinkClasses}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/whitelist" className={navLinkClasses}>
              Whitelist
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LaunchpadSidebar;
