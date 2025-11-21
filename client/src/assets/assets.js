import avatar from "./avatar.jpg";
import google from "./google-logo.png";
import neura_logo from "./favicon.svg";
import lettermark from "./lettermark.png";
import workmark from "./workmark.png";
import { GoHome } from "react-icons/go";
import { VscListFlat } from "react-icons/vsc";
import { MdOutlineAmpStories, MdEvent, MdHistory } from "react-icons/md";
import {
  LuSettings,
  LuHeadphones,
  LuClipboardPenLine,
  LuLogOut,
} from "react-icons/lu";

import {
  IoBriefcaseOutline,
  IoSchoolOutline,
  IoHomeOutline,
  IoLocationOutline,
  IoHeartOutline,
  IoEarthOutline,
  IoMailOutline,
  IoCallOutline,
  IoCalendarNumberOutline,
  IoChatbubblesOutline,
  IoPeopleOutline,
} from "react-icons/io5";

export const assets = {
  avatar,
  google,
  neura_logo,
  lettermark,
  workmark,
};

export const menuItems = [
  { label: "Trang chủ", icon: GoHome, to: "/" },
  { label: "Hồ sơ", image: avatar, to: "/profile" },
  { label: "Messages", icon: IoChatbubblesOutline, to: "/messages" },
  { label: "Bạn bè", icon: IoPeopleOutline, to: "/friends" },
  { label: "Feed", icon: VscListFlat, to: null },
  { label: "Tin", icon: MdOutlineAmpStories, to: null },
  { label: "Sự kiện", icon: MdEvent, to: null },
  { label: "Kỷ niệm", icon: MdHistory, to: null },
];

export const subMenus = [
  {
    name: "Cài đặt và quyền riêng tư",
    icon: LuSettings,
  },
  {
    name: "Trợ giúp và hỗ trợ",
    icon: LuHeadphones,
  },
  {
    name: "Đóng góp ý kiến",
    icon: LuClipboardPenLine,
  },
  {
    name: "Đăng xuất",
    icon: LuLogOut,
  },
];

export const posts = [
  {
    id: 1,
    user: {
      id: 1,
      name: "Nghia Bui",
      avatar: avatar,
    },
    content: "Buổi chiều đẹp trời, đi dạo xíu 😄",
    image:
      "https://cdn.tgdd.vn/Files/2016/02/25/792452/chup-anh-hoang-hon-bang-smartphone_800x450.jpg",
    time: "2 phút trước",
    comments_count: 3,
    reactions_count: 12,
    shares_count: 1,
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Minh Tran",
      avatar:
        "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-6.jpg",
    },
    content: "Cà phê sáng để bớt buồn ngủ ☕",
    image:
      "https://media-cdn.tripadvisor.com/media/photo-s/0b/1c/3e/6b/cappuccino.jpg",
    time: "10 phút trước",
    comments_count: 1,
    reactions_count: 5,
    shares_count: 0,
  },
  {
    id: 3,
    user: {
      id: 3,
      name: "Lan Phạm",
      avatar:
        "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-7.jpg",
    },
    content: "Hôm nay trời siêu đẹp luôn!",
    image:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-14.jpg",
    time: "20 phút trước",
    comments_count: 0,
    reactions_count: 3,
    shares_count: 0,
  },
  {
    id: 4,
    user: {
      id: 4,
      name: "Hoàng Nam",
      avatar:
        "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-2.jpg",
    },
    content: "Code suốt ngày mệt thật sự 😭",
    image: null,
    time: "35 phút trước",
    comments_count: 5,
    reactions_count: 20,
    shares_count: 2,
  },
  {
    id: 5,
    user: {
      id: 5,
      name: "Hà Lê",
      avatar:
        "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
    },
    content: "Chuẩn bị thi cuối kỳ thôi 🤯",
    image:
      "https://scontent.fhan5-3.fna.fbcdn.net/v/t39.30808-6/489396973_1162603062443994_8227669641903810476_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF3n3BNI50ep3WIn5oz-Puw37Y9rDGgg-bftj2sMaCD5tiKmppFHkKvdUjFD-LZnh7SdDtrDyX5EFo_K-8dq-HL&_nc_ohc=qEe1NINbixoQ7kNvwEgFcM0&_nc_oc=AdnTmUrVM8_92CiLQWPA9vMgJuQFys9Ss8GoKkqiEULiCcHmI8LSJ2_c-8U6VABre5I22-rf3XYvvwdpJ_mhikjP&_nc_zt=23&_nc_ht=scontent.fhan5-3.fna&_nc_gid=eDf0eWnv80Dm4yjNCShl4Q&oh=00_AfjmuTakLqoQKK6Krpk1ZOLPigSt2udYKpGxB33BNJIAfA&oe=691D14F2",
    time: "1 giờ trước",
    comments_count: 2,
    reactions_count: 7,
    shares_count: 0,
  },
];

export const contacts = [
  {
    id: 1,
    name: "Minh Tran",
    avatar:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-6.jpg",
  },
  {
    id: 2,
    name: "Hoàng Nam",
    avatar:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-2.jpg",
  },
  {
    id: 3,
    name: "Hà Lê",
    avatar:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-8.jpg",
  },
  {
    id: 4,
    name: "Lan Phạm",
    avatar:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-7.jpg",
  },
  {
    id: 5,
    name: "Trần Thiên Minh",
    avatar:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-3.jpg",
  },
  {
    id: 6,
    name: "Nam Lê",
    avatar:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-9.jpg",
  },
  {
    id: 7,
    name: "Thảo Nhi",
    avatar:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-10.jpg",
  },
  {
    id: 8,
    name: "Nguyễn Văn An",
    avatar:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-11.jpg",
  },
  {
    id: 9,
    name: "Trâm Anh",
    avatar:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-dep-13.jpg",
  },
];

export const DEFAULT_BIO = "“Luôn tò mò, luôn học hỏi – nói ít làm nhiều.”";

export const DEFAULT_INTERESTS = [
  "UI/UX",
  "Frontend",
  "Photography",
  "Travel",
  "Coffee",
  "Tech",
];

export const DEFAULT_DETAILS = {
  jobTitle: "UI/UX & Frontend Developer",
  company: "Neura",
  employmentType: "Toàn thời gian · Cá nhân",
  school: "Đại học Vinh",
  faculty: "Khoa Công nghệ thông tin",
  city: "Vinh, Nghệ An",
  hometown: "Nghệ An, Việt Nam",
  relationship: "Đang hẹn hò",
  joinDate: "Tháng 10 năm 2024",
  email: "nghiabui.design@gmail.com",
  phone: "+84 888 000 123",
  birthday: "15 tháng 04, 2001",
};

export const DEFAULT_PROFILE_INFO = {
  name: "Nghia Bui",
  friendsCount: "1.2K",
  headline: "UI/UX & Frontend Developer",
};

export const getOverviewItems = (details) => [
  {
    icon: IoBriefcaseOutline,
    text: `${details.jobTitle} tại ${details.company}`,
    subtext: details.employmentType,
  },
  {
    icon: IoSchoolOutline,
    text: `Học tại ${details.school}`,
    subtext: details.faculty,
  },
  { icon: IoHomeOutline, text: `Sống tại ${details.city}` },
  { icon: IoLocationOutline, text: `Đến từ ${details.hometown}` },
  { icon: IoHeartOutline, text: details.relationship },
  { icon: IoEarthOutline, text: `Tham gia vào ${details.joinDate}` },
];

export const getAboutSections = (details) => [
  {
    title: "Công việc và học vấn",
    items: [
      {
        icon: IoBriefcaseOutline,
        title: `${details.jobTitle} tại ${details.company}`,
        subtitle: details.employmentType,
      },
      {
        icon: IoSchoolOutline,
        title: `Học ${details.school}`,
        subtitle: details.faculty,
      },
    ],
    action: "Thêm nơi làm việc",
  },
  {
    title: "Nơi từng sống",
    items: [
      { icon: IoHomeOutline, title: `Sống tại ${details.city}` },
      { icon: IoLocationOutline, title: `Đến từ ${details.hometown}` },
    ],
    action: "Thêm thành phố",
  },
  {
    title: "Thông tin liên hệ và cơ bản",
    items: [
      { icon: IoMailOutline, title: details.email, subtitle: "Email" },
      { icon: IoCallOutline, title: details.phone, subtitle: "Điện thoại" },
      { icon: IoCalendarNumberOutline, title: `Sinh ngày ${details.birthday}` },
    ],
    action: "Chỉnh sửa thông tin liên hệ",
  },
  {
    title: "Gia đình và các mối quan hệ",
    items: [{ icon: IoPeopleOutline, title: details.relationship }],
    action: "Thêm thành viên gia đình",
  },
];

export const notifications = [
  {
    id: 1,
    type: "like",
    user: contacts[0],
    action: "thích bài viết của bạn",
    time: "5 phút trước",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    user: contacts[1],
    action: "đã bình luận bài viết của bạn",
    time: "10 phút trước",
    read: false,
  },
  {
    id: 3,
    type: "friend_request",
    user: contacts[2],
    action: "đã gửi lời mời kết bạn",
    time: "1 giờ trước",
    read: true,
  },
  {
    id: 4,
    type: "like",
    user: contacts[3],
    action: "thích bài viết của bạn",
    time: "2 giờ trước",
    read: true,
  },
  {
    id: 5,
    type: "friend_accept",
    user: contacts[4],
    action: "đã chấp nhận lời mời kết bạn",
    time: "3 giờ trước",
    read: true,
  },
];
