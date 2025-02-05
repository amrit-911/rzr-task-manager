import { User } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../context/authContext"; // Adjust the import path as needed
import image from "../assets/rzrTaskManager.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useContext(AuthContext); // Destructure logout function from context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const dropdownRef = useRef(null); // Ref to track the dropdown container
  const navigate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full sticky top-0 bg-white z-30 shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600 cursor-pointer">
        <img
          src={image}
          alt="logo"
          className="w-40 h-15"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <div
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition duration-300"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
        >
          {/* Profile Icon */}
          <User className="w-6 h-6 text-gray-600" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-10">
            <button
              className="w-full text-left px-4 py-2 text-sm text-white cursor-pointer hover:bg-red-700 bg-red-500 transition duration-300"
              onClick={logout} // Call the logout function when clicked
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
