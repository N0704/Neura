import React from "react";
import {
  IoBriefcaseOutline,
  IoSchoolOutline,
  IoHomeOutline,
  IoLocationOutline,
  IoHeartOutline,
  IoEarthOutline,
} from "react-icons/io5";

const defaultOverviewItems = [
  {
    icon: IoBriefcaseOutline,
    text: "UI/UX & Frontend Developer tại Neura",
    subtext: "Toàn thời gian · Cá nhân",
  },
  {
    icon: IoSchoolOutline,
    text: "Học tại Đại học Vinh",
    subtext: "Khoa Công nghệ thông tin",
  },
  {
    icon: IoHomeOutline,
    text: "Sống tại Vinh, Nghệ An",
  },
  {
    icon: IoLocationOutline,
    text: "Đến từ Nghệ An, Việt Nam",
  },
  {
    icon: IoHeartOutline,
    text: "Đang hẹn hò",
  },
  {
    icon: IoEarthOutline,
    text: "Tham gia vào tháng 10 năm 2024",
  },
];

const defaultInterests = [
  "UI/UX",
  "Frontend",
  "Photography",
  "Travel",
  "Coffee",
  "Tech",
];

const ProfileIntro = ({
  onEditBio,
  onEditDetails,
  onEditInterests,
  bio = "“Luôn tò mò, luôn học hỏi – nói ít làm nhiều.”",
  overviewItems = defaultOverviewItems,
  interests = defaultInterests,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
      <div>
        <h2 className="text-[15px] font-semibold text-gray-900 mb-1">
          Giới thiệu
        </h2>
        <p className="text-sm text-gray-600">{bio}</p>
        <button
          className="mt-2 px-4 py-1.5 text-xs font-medium bg-gray-100 rounded-lg text-gray-800 hover:bg-gray-200 transition cursor-pointer"
          onClick={() => onEditBio?.()}
        >
          Chỉnh sửa tiểu sử
        </button>
      </div>

      <div className="pt-4 border-t border-gray-100 space-y-3">
        {overviewItems.map((item) => (
          <div key={item.text} className="flex items-start gap-3">
            <item.icon className="text-gray-500 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-gray-900">{item.text}</p>
              {item.subtext && (
                <p className="text-xs text-gray-500">{item.subtext}</p>
              )}
            </div>
          </div>
        ))}
        <button
          className="w-full py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-800 hover:bg-gray-200 transition cursor-pointer"
          onClick={() => onEditDetails?.()}
        >
          Chỉnh sửa chi tiết
        </button>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Sở thích nổi bật
          </h3>
          <button
            className="text-xs font-medium text-gray-600 hover:underline cursor-pointer"
            onClick={() => onEditInterests?.()}
          >
            Chỉnh sửa
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileIntro;

