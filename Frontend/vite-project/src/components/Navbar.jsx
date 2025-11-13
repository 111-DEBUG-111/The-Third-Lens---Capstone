import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-right">
          <span className="text-left">Third</span>
          <span className="text-left">Lens</span>
        </Link>

        <div className="flex space-x-6 font-semibold text-gray-700">
          <Link to="/login" className="hover:text-left transition">
            Login
          </Link>
          <Link to="/signup" className="hover:text-right transition">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
