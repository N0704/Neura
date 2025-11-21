import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileIntro from "../components/profile/ProfileIntro";
import ProfilePhotos from "../components/profile/ProfilePhotos";
import ProfilePosts from "../components/profile/ProfilePosts";
import ProfileFriends from "../components/profile/ProfileFriends";
import ProfileAboutDetails from "../components/profile/ProfileAboutDetails";
import ProfileModalManager from "../components/profile/ProfileModalManager";
import { PROFILE_TABS } from "../constants/profileTabs";
import {
  DEFAULT_BIO,
  DEFAULT_INTERESTS,
  DEFAULT_DETAILS,
  DEFAULT_PROFILE_INFO,
  getOverviewItems,
  getAboutSections,
} from "../assets/assets";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(PROFILE_TABS[0]);
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [interests, setInterests] = useState(DEFAULT_INTERESTS);
  const [details, setDetails] = useState(DEFAULT_DETAILS);
  const [profileInfo, setProfileInfo] = useState(DEFAULT_PROFILE_INFO);
  const [modal, setModal] = useState({ type: null, payload: null });

  const [bioDraft, setBioDraft] = useState(bio);
  const [detailsDraft, setDetailsDraft] = useState(details);
  const [interestsDraft, setInterestsDraft] = useState(interests.join(", "));
  const [profileInfoDraft, setProfileInfoDraft] = useState(profileInfo);

  useEffect(() => {
    if (modal.type === "editBio") setBioDraft(bio);
    if (modal.type === "editDetails") setDetailsDraft(details);
    if (modal.type === "editInterests") setInterestsDraft(interests.join(", "));
    if (modal.type === "editProfile") setProfileInfoDraft(profileInfo);
  }, [modal.type, bio, details, interests, profileInfo]);

  const openModal = (type, payload = null) => setModal({ type, payload });
  const closeModal = () => setModal({ type: null, payload: null });

  const handleBioSave = () => {
    setBio(bioDraft.trim() || DEFAULT_BIO);
    closeModal();
  };
  const handleDetailsSave = () => {
    setDetails(detailsDraft);
    closeModal();
  };
  const handleInterestsSave = () => {
    const list = interestsDraft
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    setInterests(list.length ? list : DEFAULT_INTERESTS);
    closeModal();
  };
  const handleProfileInfoSave = () => {
    setProfileInfo(profileInfoDraft);
    closeModal();
  };

  const overviewItems = getOverviewItems(details);
  const aboutSections = getAboutSections(details);
  const subtitle = `${profileInfo.friendsCount} bạn bè · ${profileInfo.headline}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <Header />
      <main className="flex-1 pt-16">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-0 py-6 space-y-4">
          <ProfileHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onEditProfile={() => openModal("editProfile")}
            name={profileInfo.name}
            subtitle={subtitle}
          />

          {activeTab === "Bài viết" && (
            <section className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 md:gap-6">
              <div className="space-y-4">
                <ProfileIntro
                  bio={bio}
                  overviewItems={overviewItems}
                  interests={interests}
                  onEditBio={() => openModal("editBio")}
                  onEditDetails={() => openModal("editDetails")}
                  onEditInterests={() => openModal("editInterests")}
                />
                <ProfilePhotos />
              </div>
              <ProfilePosts />
            </section>
          )}

          {activeTab === "Giới thiệu" && (
            <section className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 md:gap-6">
              <div className="space-y-4">
                <ProfileIntro
                  bio={bio}
                  overviewItems={overviewItems}
                  interests={interests}
                  onEditBio={() => openModal("editBio")}
                  onEditDetails={() => openModal("editDetails")}
                  onEditInterests={() => openModal("editInterests")}
                />
              </div>
              <ProfileAboutDetails
                sections={aboutSections}
                onEditSection={(section) =>
                  openModal("editAboutSection", { section })
                }
              />
            </section>
          )}

          {activeTab === "Bạn bè" && <ProfileFriends />}

          {activeTab !== "Bài viết" &&
            activeTab !== "Giới thiệu" &&
            activeTab !== "Bạn bè" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-sm text-gray-700">
                Nội dung cho tab{" "}
                <span className="font-medium">{activeTab}</span> đang được cập
                nhật.
              </div>
            )}
        </div>
      </main>

      <ProfileModalManager
        modal={modal}
        closeModal={closeModal}
        bioDraft={bioDraft}
        setBioDraft={setBioDraft}
        detailsDraft={detailsDraft}
        setDetailsDraft={setDetailsDraft}
        interestsDraft={interestsDraft}
        setInterestsDraft={setInterestsDraft}
        profileInfoDraft={profileInfoDraft}
        setProfileInfoDraft={setProfileInfoDraft}
        handleBioSave={handleBioSave}
        handleDetailsSave={handleDetailsSave}
        handleInterestsSave={handleInterestsSave}
        handleProfileInfoSave={handleProfileInfoSave}
      />
    </div>
  );
};

export default Profile;
