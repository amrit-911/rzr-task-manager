import { useState, useContext } from "react";
import AuthContext from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-[90vh] bg-gray-100">
      <div className=" p-6 rounded shadow-md w-80 sm:w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
          <div className="text-blue-700">
            <span> New here ? </span>
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
