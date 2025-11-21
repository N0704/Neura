import { useState, useRef, useEffect } from "react";
import {
  IoCloseOutline,
  IoImageOutline,
  IoHappyOutline,
  IoChevronDownOutline,
  IoEarth,
  IoPeople,
  IoLockClosed,
  IoLocationOutline,
  IoPricetagOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import { useDispatch } from "react-redux";
import { addPost } from "../store/postsSlice";
import { assets } from "../assets/assets";
import FeelingModal from "./FeelingModal.jsx";
import { Link } from "react-router-dom";

const audienceOptions = [
  {
    value: "public",
    label: "Công khai",
    description: "Mọi người ở trên hoặc ngoài Neura đều có thể thấy",
    icon: IoEarth,
    size: 20,
  },
  {
    value: "friends",
    label: "Bạn bè",
    description: "Chỉ bạn bè của bạn mới xem được",
    icon: IoPeople,
    size: 15,
  },
  {
    value: "private",
    label: "Chỉ mình tôi",
    description: "Chỉ bạn mới nhìn thấy bài viết này",
    icon: IoLockClosed,
    size: 15,
  },
];

const backgrounds = [
  { id: "sunset", className: "bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500" },
  { id: "lagoon", className: "bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500" },
  { id: "lavender", className: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" },
  { id: "citrus", className: "bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500" },
  { id: "graphite", className: "bg-gradient-to-br from-slate-700 via-gray-800 to-black" },
];

const PostComposerModal = ({ isOpen, onClose, intent }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [privacy, setPrivacy] = useState(audienceOptions[0]);
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [feelingModalOpen, setFeelingModalOpen] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      setContent("");
      setSelectedBackground(null);
      setSelectedFeeling(null);
      setPrivacy(audienceOptions[0]);
      setFeelingModalOpen(false);
      setShowPrivacyMenu(false);
    }
  }, [isOpen, imagePreview]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
      if (intent === "photo") {
        fileInputRef.current?.click();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [isOpen, intent]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const backgroundDisabled = Boolean(imagePreview);
  const canPost =
    content.trim().length > 0 || Boolean(imagePreview) || selectedFeeling;

  const handleSubmit = () => {
    if (!canPost) return;
    dispatch(addPost({
      content,
      image: imagePreview,
      background: selectedBackground?.className || null,
      feeling: selectedFeeling,
      privacy,
    }));
    setContent("");
    setSelectedFeeling(null);
    if (!backgroundDisabled) {
      setSelectedBackground(null);
    }
    if (imagePreview) {
      handleRemoveImage();
    }
    onClose();
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const renderPrivacyMenu = () => {
    if (!showPrivacyMenu) return null;
    return (
      <div className="absolute z-10 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2">
        {audienceOptions.map((option) => {
          const Icon = option.icon;
          const isActive = option.value === privacy.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setPrivacy(option);
                setShowPrivacyMenu(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg flex gap-3 items-start hover:bg-gray-50 cursor-pointer ${
                isActive ? "bg-gray-50" : ""
              }`}
            >
              <Icon className="mt-0.5 text-gray-600" size={option.size} />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {option.label}
                </p>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 w-full h-full"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-semibold text-gray-900">Tạo bài viết</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          <div className="flex items-center gap-3">
            <img
              src={assets.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <Link to="/profile" className="text-sm font-semibold text-gray-900 cursor-pointer hover:underline">Nghia Bui</Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPrivacyMenu((prev) => !prev)}
                  className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-xl cursor-pointer"
                >
                  {privacy.label}
                  <IoChevronDownOutline size={13}/>
                </button>
                {renderPrivacyMenu()}
              </div>
            </div>
          </div>
          <div
            className={`rounded-2xl ${
              selectedBackground?.className
                ? `${selectedBackground.className} text-white`
                : ""
            }`}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                selectedBackground
                  ? "Hãy chia sẻ điều gì đó..."
                  : "Bạn đang nghĩ gì?"
              }
              maxLength={1000}
              className={`w-full ${
                selectedBackground
                  ? "min-h-[200px] text-2xl text-center font-semibold leading-tight placeholder:text-white/60 px-6 py-10"
                  : "min-h-[120px] text-lg text-gray-900 px-1 py-2"
              } bg-transparent resize-none border-none focus:ring-0 focus:outline-none placeholder:text-gray-400 whitespace-pre-line`}
            />
            <div
              className={`flex justify-end text-xs ${
                selectedBackground ? "text-white/80 pr-6 pb-4" : "text-gray-400"
              }`}
            >
              {content.length}/1000
            </div>
          </div>
          {selectedFeeling && (
            <div className="flex items-center gap-2 text-sm text-gray-900 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              <IoHappyOutline />
              <p>
                Bạn đang cảm thấy <span className="font-semibold">{selectedFeeling}</span>
              </p>
              <button
                type="button"
                className="ml-auto text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setSelectedFeeling(null)}
              >
                Xoá
              </button>
            </div>
          )}
          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <button
                onClick={handleRemoveImage}
                className="absolute right-4 top-4 bg-black/60 hover:bg-black/80 rounded-full p-1.5"
                aria-label="Xoá ảnh"
              >
                <IoCloseOutline className="text-white w-4 h-4" />
              </button>
              <img
                src={imagePreview}
                alt="Ảnh đính kèm"
                className="w-full max-h-[360px] object-contain"
              />
            </div>
          )}
          {!backgroundDisabled && (
            <div className="border border-dashed border-gray-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Nền màu
              </p>
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSelectedBackground(null)}
                  className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xs font-semibold cursor-pointer ${
                    !selectedBackground ? "ring-2 ring-gray-500" : ""
                  }`}
                >
                  Aa
                </button>
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    className={`w-10 h-10 rounded-full cursor-pointer ${bg.className} ${
                      selectedBackground?.id === bg.id
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedBackground(bg)}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="border border-gray-200 rounded-xl px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Thêm vào bài viết của bạn
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IoImageOutline className="text-green-500" size={22} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                  onClick={() => setFeelingModalOpen(true)}
                >
                  <IoHappyOutline className="text-yellow-500" size={22} />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                  <IoLocationOutline className="text-red-500" size={20} />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                  <IoPersonAddOutline className="text-blue-500" size={20} />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                  <IoPricetagOutline className="text-purple-500" size={20} />
                </button>
              </div>
            </div>
            {backgroundDisabled && (
              <p className="text-xs text-gray-500">
                Không thể dùng nền màu khi đính kèm ảnh/video.
              </p>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canPost}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer ${
              canPost
                ? "bg-gray-900 text-white hover:bg-gray-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            Đăng
          </button>
        </div>
        <FeelingModal
          isOpen={feelingModalOpen}
          onClose={() => setFeelingModalOpen(false)}
          onSelectFeeling={(feeling) => {
            setSelectedFeeling(feeling);
            if (!feeling) setFeelingModalOpen(false);
          }}
          currentFeeling={selectedFeeling}
        />
      </div>
    </div>
  );
};

export default PostComposerModal;


