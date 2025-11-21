import React from "react";
import { IoCloseOutline, IoHappyOutline } from "react-icons/io5";

const feelingCategories = [
  {
    label: "Cảm xúc tích cực",
    items: [
      "vui vẻ",
      "hạnh phúc",
      "phấn khích",
      "biết ơn",
      "đầy cảm hứng",
      "háo hức",
      "tự hào",
      "yêu đời",
      "lạc quan",
    ],
  },
  {
    label: "Cảm xúc thư giãn",
    items: [
      "thoải mái",
      "an yên",
      "bình yên",
      "tự tại",
      "thư giãn",
      "điềm tĩnh",
    ],
  },
  {
    label: "Cảm xúc khác",
    items: ["hoài niệm", "mơ mộng", "sáng tạo", "ngạc nhiên", "xúc động"],
  },
];

const FeelingModal = ({
  isOpen,
  onClose,
  onSelectFeeling,
  currentFeeling,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">
            Bạn đang cảm thấy thế nào?
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 overflow-y-auto">
          {feelingCategories.map((category) => (
            <div key={category.label}>
              <p className="text-xs font-semibold text-gray-500 mb-2">
                {category.label}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {category.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onSelectFeeling(item)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition ${
                      currentFeeling === item
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    <IoHappyOutline className="text-yellow-500" />
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
            onClick={() => onSelectFeeling(null)}
          >
            Xoá cảm xúc
          </button>

          <button
            type="button"
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={onClose}
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeelingModal;


