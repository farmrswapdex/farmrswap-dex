import { NavLink } from 'react-router-dom';

const LaunchpadSidebar = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean; }) =>
    `block py-2.5 px-4 rounded transition duration-200 ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
    }`;

  return (
    <div className="fixed top-24 left-4 w-64 bg-gray-800/50 backdrop-blur-lg text-white rounded-lg shadow-xl h-fit">
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className={navLinkClasses}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/create" className={navLinkClasses}>
              Create
            </NavLink>
          </li>
          <li>
            <NavLink to="/launchpad" end className={navLinkClasses}>
              Projects
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LaunchpadSidebar;
