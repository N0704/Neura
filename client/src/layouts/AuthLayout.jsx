import Logo from "../assets/workmark.png";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const initializing = useSelector((state) => state.auth.initializing);

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-white to-gray-200 text-gray-600">
        Đang tải...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-gray-200 relative">
      <Link to="/" className="absolute top-8 left-15">
        <img src={Logo} alt="Neura" className="h-5 object-contain" />
      </Link>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
