import React from "react";
import { assets } from "../assets/assets";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const initializing = useSelector((state) => state.auth.initializing);

  if (initializing) {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#f0f2f5]">
  <img
    src={assets.neura_logo}
    alt="logo"
    className="h-22 w-22 object-contain opacity-90 mb-28"
  />

  <div className="absolute bottom-8 flex flex-col items-center text-gray-500">
    <span className="text-sm font-medium mb-2.5">from</span>
      <img
        src={assets.workmark} // cần ảnh logo Meta
        alt="meta"
        className="h-3"
      />
  </div>
</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default MainLayout;
