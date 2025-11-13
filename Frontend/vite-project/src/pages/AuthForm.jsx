import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, signup } from "../services/api";

export default function AuthForm({ type }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === "signup") {
        await signup(form);
        alert("Signup successful!");
        navigate("/login");
      } else {
        const res = await login(form);
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-political-gradient text-gray-900">
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
        <h2 className="text-black text-3xl font-bold text-center mb-3">
          {type === "login" ? "Welcome Back" : "Join The Third Lens"}
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          {type === "login"
            ? "Understand all perspectives. Log in to continue."
            : "See what Left, Right, and Facts say — all in one place."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-center"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-center"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-center"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg transition ${
              type === "login"
                ? "bg-right hover:bg-right/90"
                : "bg-left hover:bg-left/90"
            }`}
          >
            {loading
              ? "Processing..."
              : type === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {type === "login" ? (
            <>
              Don’t have an account?{" "}
              <Link to="/signup" className="text-left font-semibold">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already a member?{" "}
              <Link to="/login" className="text-right font-semibold">
                Login
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
