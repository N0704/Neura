import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../store/messagesSlice";
import { IoHappyOutline, IoImageOutline, IoPaperPlane, IoCloseOutline } from "react-icons/io5";

const MessageInput = () => {
  const dispatch = useDispatch();
  const activeConversationId = useSelector((state) => state.messages.activeConversationId);
  const [messageText, setMessageText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [messageText]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((messageText.trim() || imagePreview) && activeConversationId) {
      dispatch(sendMessage({ conversationId: activeConversationId, text: messageText, image: imagePreview }));
      setMessageText("");
      handleRemoveImage();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!activeConversationId) {
    return null;
  }

  return (
    <div className="border-t border-gray-100 px-4 py-3 bg-white">
      {imagePreview && (
        <div className="relative mb-2 rounded-lg overflow-hidden bg-gray-100 max-w-xs">
          <button
            onClick={handleRemoveImage}
            className="absolute right-2 top-2 bg-black/60 hover:bg-black/80 rounded-full p-1"
          >
            <IoCloseOutline className="text-white w-4 h-4" />
          </button>
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-48 object-contain"
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2">
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-gray-200 transition"
          >
            <IoHappyOutline size={22} className="text-gray-600" />
          </button>
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-900 placeholder:text-gray-500 max-h-[120px]"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-full hover:bg-gray-200 transition"
          >
            <IoImageOutline size={22} className="text-gray-600" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <button
          type="submit"
          disabled={!messageText.trim() && !imagePreview}
          className={`p-2.5 rounded-full transition cursor-pointer ${
            messageText.trim() || imagePreview
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <IoPaperPlane size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

