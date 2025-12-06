import { useState } from "react";
import { assets } from "../assets/assets";
import { IoImageOutline, IoHappyOutline } from "react-icons/io5";
import PostComposerModal from "./PostComposerModal.jsx";
import { useSelector } from "react-redux";

const PostShare = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intent, setIntent] = useState(null);
  const currentUser = useSelector((state) => state.auth.user);

  const openModal = (nextIntent = null) => {
    setIntent(nextIntent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIntent(null);
  };

  return (
    <>
      <div className="flex flex-col gap-3 bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar || assets.avatar}
            alt="avatar"
            className="rounded-full w-10 h-10 object-cover cursor-pointer"
          />
          <button
            type="button"
            onClick={() => openModal()}
            className="flex-1 text-left bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-2xl text-sm text-gray-600 transition cursor-pointer"
          >
            Bạn đang nghĩ gì thế?
          </button>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-2 gap-3 text-sm font-medium">
          <button
            type="button"
            onClick={() => openModal("photo")}
            className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-700 cursor-pointer"
          >
            <IoImageOutline className="text-green-500" size={20} />
            Ảnh/Video
          </button>
          <button
            type="button"
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-50 text-gray-700 cursor-pointer"
          >
            <IoHappyOutline className="text-yellow-500" size={20} />
            Cảm xúc/Hoạt động
          </button>
        </div>
      </div>

      <PostComposerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        intent={intent}
      />
    </>
  );
};

export default PostShare;
