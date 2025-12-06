import React, { useState } from "react";
import { menuItems } from "../assets/assets";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PostComposerModal from "./PostComposerModal";

const Sidebar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [intent, setIntent] = useState(null);
  const currentUser = useSelector((state) => state.auth.user);

  const openModal = (item, nextIntent = null) => {
    setSelectedItem(item);
    setIntent(nextIntent);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setIntent(null);
  };

  const renderModal = () => {
    if (!isModalOpen || !selectedItem) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
        onClick={closeModal}
      >
        <div
          className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">
              {selectedItem.label}
            </h3>

            <button
              onClick={closeModal}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer"
            >
              <IoClose size={18} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
            <p>
              Tính năng cho mục{" "}
              <span className="font-medium">{selectedItem.label}</span> sẽ sớm
              được bổ sung. Hiện tại bạn có thể trải nghiệm các tính năng khác.
            </p>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-3 py-4 text-[15px] text-gray-800">
      {renderModal()}

      {/* Menu */}
      <div className="flex flex-col gap-0.5 mb-3">
        {menuItems.map((item) => {
          // Override avatar for Profile item
          const displayItem = item.label === "Hồ sơ"
            ? { ...item, image: currentUser?.avatar || item.image }
            : item;

          return displayItem.to === null ? (
            // Items mở modal
            <button
              key={displayItem.label}
              onClick={() => openModal(displayItem)}
              className="flex items-center gap-3.5 rounded-xl p-3 hover:bg-gray-100 transition w-full text-left cursor-pointer"
            >
              {displayItem.icon ? (
                <displayItem.icon size={24} className="text-gray-600" />
              ) : (
                <img
                  src={displayItem.image}
                  alt={displayItem.label}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <p>{displayItem.label}</p>
            </button>
          ) : (
            // Items có link
            <NavLink
              key={displayItem.to}
              to={displayItem.to}
              end={displayItem.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl p-3 transition ${isActive ? "bg-gray-100" : "hover:bg-gray-100"
                }`
              }
            >
              {displayItem.icon ? (
                <displayItem.icon size={24} className="text-gray-600" />
              ) : (
                <img
                  src={displayItem.image}
                  alt={displayItem.label}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <p>{displayItem.label}</p>
            </NavLink>
          );
        })}
      </div>

      {/* Đăng tin */}
      <button
        onClick={() => openModal({ label: "Đăng tin" }, "create-post")}
        className="flex items-center justify-center text-white font-medium bg-black gap-3.5 rounded-xl p-3 hover:opacity-90 transition w-full cursor-pointer"
      >
        Đăng tin
      </button>

      {/* Composer Modal */}
      <PostComposerModal
        isOpen={isModalOpen && intent === "create-post"}
        onClose={closeModal}
        intent={intent}
      />
    </div>
  );
};

export default Sidebar;
