import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/authContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  console.log("user1", user);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
