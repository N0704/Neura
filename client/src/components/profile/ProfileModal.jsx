import React from "react";
import { IoClose } from "react-icons/io5";

const ProfileModal = ({ title, children, onClose, onSubmit, submitLabel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer"
          >
            <IoClose size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
          {children}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition cursor-pointer"
          >
            {submitLabel || "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
