import React from "react";
import ProfileModal from "./ProfileModal";

const ProfileModalManager = ({
  modal,
  closeModal,
  bioDraft,
  setBioDraft,
  detailsDraft,
  setDetailsDraft,
  interestsDraft,
  setInterestsDraft,
  profileInfoDraft,
  setProfileInfoDraft,
  handleBioSave,
  handleDetailsSave,
  handleInterestsSave,
  handleProfileInfoSave,
}) => {
  switch (modal.type) {
    case "editBio":
      return (
        <ProfileModal
          title="Chỉnh sửa tiểu sử"
          onClose={closeModal}
          onSubmit={handleBioSave}
        >
          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value)}
            maxLength={200}
            className="w-full h-32 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
          <p className="text-xs text-gray-500 text-right">
            {bioDraft.length}/200
          </p>
        </ProfileModal>
      );

    case "editDetails":
      return (
        <ProfileModal
          title="Chỉnh sửa chi tiết"
          onClose={closeModal}
          onSubmit={handleDetailsSave}
        >
          <div className="space-y-3">
            {Object.keys(detailsDraft)
              .slice(0, 8)
              .map((key) => (
                <input
                  key={key}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={detailsDraft[key]}
                  onChange={(e) =>
                    setDetailsDraft({ ...detailsDraft, [key]: e.target.value })
                  }
                  placeholder={key}
                />
              ))}
          </div>
        </ProfileModal>
      );

    case "editInterests":
      return (
        <ProfileModal
          title="Chỉnh sửa sở thích"
          onClose={closeModal}
          onSubmit={handleInterestsSave}
        >
          <textarea
            value={interestsDraft}
            onChange={(e) => setInterestsDraft(e.target.value)}
            className="w-full h-32 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            placeholder="Nhập các sở thích, ngăn cách bởi dấu phẩy"
          />
          <p className="text-xs text-gray-500">
            Ví dụ: UI/UX, Frontend, Nghệ thuật
          </p>
        </ProfileModal>
      );

    case "editProfile":
      return (
        <ProfileModal
          title="Chỉnh sửa trang cá nhân"
          onClose={closeModal}
          onSubmit={handleProfileInfoSave}
        >
          <div className="space-y-3">
            {Object.keys(profileInfoDraft).map((key) => (
              <input
                key={key}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profileInfoDraft[key]}
                onChange={(e) =>
                  setProfileInfoDraft({
                    ...profileInfoDraft,
                    [key]: e.target.value,
                  })
                }
                placeholder={key}
              />
            ))}
          </div>
        </ProfileModal>
      );

    case "editAboutSection":
      return (
        <ProfileModal
          title={`Chỉnh sửa ${modal.payload?.section || "thông tin"}`}
          onClose={closeModal}
          onSubmit={closeModal}
          submitLabel="Đóng"
        >
          <p>
            Tính năng chỉnh sửa chi tiết cho mục{" "}
            <span className="font-medium">{modal.payload?.section || ""}</span>{" "}
            sẽ sớm được bổ sung. Hiện tại bạn có thể chỉnh sửa các thông tin
            chung ở phần bên trái.
          </p>
        </ProfileModal>
      );

    default:
      return null;
  }
};

export default ProfileModalManager;
