import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error("Error registering account");
    }
  };

  return (
    <div className="flex justify-center items-center h-[90vh] bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md sm:w-96 w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Register
          </button>
          <div className="text-blue-700">
            <span> Already have an account? </span>
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
