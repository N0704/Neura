import React, { useEffect, useState } from "react";
import { postsAPI } from "../../api/postsAPI";

const ProfilePhotos = ({ userId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await postsAPI.getUserPhotos(userId);
        setPhotos(response.data || []);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
        <div className="h-5 w-16 bg-gray-200 rounded mb-3" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-semibold text-gray-900">Ảnh</h2>
        <button className="text-xs font-medium text-gray-600 hover:underline cursor-pointer">
          Xem tất cả ảnh
        </button>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="w-full aspect-square rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:brightness-95 transition-all"
            >
              <img
                src={photo.file_url}
                alt="User photo"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">Chưa có ảnh nào</p>
      )}
    </div>
  );
};

export default ProfilePhotos;


