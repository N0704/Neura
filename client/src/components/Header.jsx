import React, { useState, useRef, useEffect } from "react";
import { assets, subMenus } from "../assets/assets";
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io";
import { IoChatbubblesOutline, IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../store/authSlice";
import { LuChevronRight } from "react-icons/lu";

const Header = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    setShowProfileMenu(false);
    navigate("/login");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-xs">
        <div className=" grid grid-cols-[280px_1fr_280px] items-center h-16 px-4 sm:px-6 lg:px-8 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={assets.workmark}
              alt="Logo"
              className="h-[18px] object-contain"
            />
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center justify-center">
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 w-full bg-gray-100 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200 transition cursor-pointer"
            >
              <IoSearch size={18} />
              <span className="text-sm text-gray-500">
                Tìm kiếm trên Neura...
              </span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-2 text-gray-800">
            {/* Mobile Search */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <IoSearch size={22} />
            </button>

            <Link
              to="/messages"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <IoChatbubblesOutline size={20} />
            </Link>
            <Link
              to="/notifications"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <IoMdNotificationsOutline size={20} />
            </Link>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center cursor-pointer relative"
              >
                <img
                  src={currentUser?.avatar || assets.avatar}
                  alt="avatar"
                  className="w-11 h-11 rounded-full border border-gray-200 hover:opacity-90 transition object-cover"
                />
                <div className="absolute right-0 bottom-0 bg-white rounded-full p-0.5">
                  <IoIosArrowDown
                    size={12}
                    className="text-gray-600 bg-gray-200 rounded-full"
                  />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute -right-1 mt-1 w-90 bg-gray-100 p-4 shadow-lg rounded-xl overflow-hidden transition-all duration-200">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex flex-col gap-2 items-center justify-center pt-2 pb-3"
                  >
                    <img
                      src={currentUser?.avatar || assets.avatar}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{currentUser?.username || 'User'}</p>
                    </div>
                  </Link>
                  <ul className="flex flex-col bg-white rounded-xl">
                    {subMenus.map((item, index) => (
                      <li
                        key={index}
                        className="w-full hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                      >
                        {item.name == "Đăng xuất" ? (
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3
                            text-[#595959] p-4 w-full h-full cursor-pointer"
                          >
                            <item.icon className="w-5 h-5" />
                            <p className="font-medium">{item.name}</p>
                          </button>
                        ) : (
                          <a
                            href={item.link || "#"}
                            className="flex items-center gap-3
                            text-[#595959] p-4 w-full h-full"
                          >
                            <item.icon className="w-5 h-5" />
                            <p className="font-medium">{item.name}</p>
                          </a>
                        )}
                        {item.name === "Đăng xuất" ||
                          item.name === "Đóng góp ý kiến" ? (
                          ""
                        ) : (
                          <LuChevronRight className="w-5 h-5 text-[#595959] mr-3" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </>
  );
};

export default Header;
