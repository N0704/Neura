import React from "react";

const ProfilePhotos = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-semibold text-gray-900">Ảnh</h2>
        <button className="text-xs font-medium text-gray-600 hover:underline cursor-pointer">
          Xem tất cả ảnh
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((photo) => (
          <div
            key={photo}
            className="w-full aspect-square rounded-lg bg-gray-100 hover:brightness-95 hover:-translate-y-px transition-transform duration-150"
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePhotos;


