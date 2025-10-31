import Logo from "../assets/workmark.png";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-gray-200 relative">
      <div className="absolute top-8 left-15">
        <img src={Logo} alt="Neura" className="h-5 object-contain" />
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
