import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import wooman from "../../images/logo/womam.png";
import bg from "../../images/logo/bg.png";
import user from "../../images/icon/Vector-1.png";
import lock from "../../images/icon/Vector-2.png";
import light from "../../images/icon/light.png";

function Login() {
  const [email, setEmail] = useState<string>(""); // State for email
  const [password, setPassword] = useState<string>(""); // State for password
  const [error, setError] = useState<string>(""); // State for error messages
  const [success, setSuccess] = useState<string>(""); // State for success messages
  const [loading, setLoading] = useState<boolean>(false); // State for loading status
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password.");
      }

      const data = await response.json();
      const { access_token } = data;

      localStorage.setItem("token", access_token); // Save token to local storage
      setSuccess("Login successful!");
      setError("");
      navigate("services/create"); // Navigate to the desired page
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setSuccess("");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex">
      {/* Left Section */}
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-3xl font-bold text-center mb-4">LOGIN</h2>
        <p className="text-gray-700 text-center mb-6 text-lg">
          Welcome! Please login to continue.
        </p>
        <form onSubmit={handleSubmit} className="flex justify-center gap-4 items-center flex-col">
          {/* Email Input */}
          <div className="relative w-[150%] max-w-sm">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <img src={user} alt="User Icon" className="w-4" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-10 py-3 rounded-2xl shadow-sm bg-[#e4e6f8] placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Password Input */}
          <div className="relative w-[150%] max-w-sm mt-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <img src={lock} alt="Password Icon" className="w-4" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-3 rounded-2xl shadow-sm bg-[#e4e6f8] placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Submit Button */}
          <div className="mt-6 w-2/3 max-w-sm">
            <button
              type="submit"
              className={`w-full px-5 py-3 ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-xl font-semibold text-white rounded-2xl transition-all duration-300`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login Now"}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>

      {/* Right Section (Hidden for Small Screens) */}
      <div
        className="w-full items-center justify-center bg-cover hidden lg:flex"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="text-start bg-blue-600 w-[450px] h-[650px] p-10 rounded-[40px] absolute z-0">
          <p className="text-3xl font-bold text-white leading-snug">
            Very good <br /> works are <br />
            waiting for <br /> you! Login <br /> Now!!!
          </p>
          <img src={light} alt="Lightning Icon" className="relative right-16 top-32 w-16" />
        </div>
        <img
          src={wooman}
          alt="Login promo"
          className="relative left-10 top-7 z-10"
        />
      </div>
    </div>
  );
}

export default Login;
