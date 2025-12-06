import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { usersAPI } from "../api/usersAPI";
import Header from "../components/Header";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileIntro from "../components/profile/ProfileIntro";
import ProfilePhotos from "../components/profile/ProfilePhotos";
import ProfilePosts from "../components/profile/ProfilePosts";
import ProfileFriends from "../components/profile/ProfileFriends";
import ProfileFriendsWidget from "../components/profile/ProfileFriendsWidget";
import ProfileAboutDetails from "../components/profile/ProfileAboutDetails";
import ProfileModalManager from "../components/profile/ProfileModalManager";
import PostSkeleton from "../components/PostSkeleton";
import FriendButton from "../components/FriendButton";
import FollowButton from "../components/FollowButton";
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
  const { userId } = useParams();
  const currentUser = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState(PROFILE_TABS[0]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Own profile states
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [interests, setInterests] = useState(DEFAULT_INTERESTS);
  const [details, setDetails] = useState(DEFAULT_DETAILS);
  const [profileInfo, setProfileInfo] = useState(DEFAULT_PROFILE_INFO);
  const [modal, setModal] = useState({ type: null, payload: null });

  const [bioDraft, setBioDraft] = useState(bio);
  const [detailsDraft, setDetailsDraft] = useState(details);
  const [interestsDraft, setInterestsDraft] = useState(interests.join(", "));
  const [profileInfoDraft, setProfileInfoDraft] = useState(profileInfo);

  // Check if viewing own profile
  const isOwnProfile = !userId || (currentUser && userId == currentUser.id);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      // Always fetch profile from API to get latest data including avatar
      const targetUserId = userId || currentUser?.id;

      if (!targetUserId) {
        setProfileUser(null);
        return;
      }

      try {
        setLoading(true);
        const response = await usersAPI.getUserProfile(targetUserId);
        setProfileUser(response.data);
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to currentUser if API fails and viewing own profile
        if (!userId && currentUser) {
          setProfileUser(currentUser);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, currentUser?.id]);

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

  const displayName = profileUser?.username || profileInfo.name;
  const displayBio = profileUser?.bio || bio;
  const friendCount = profileUser?.friends_count || 0;
  const subtitle = `${friendCount} người bạn`;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
        <Header />
        <main className="flex-1 pt-16">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-0 py-6 space-y-4">
            {/* Profile Header Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Cover Skeleton */}
              <div className="h-56 w-full bg-gray-200 animate-pulse" />

              <div className="px-6 pt-1 pb-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-14">
                  <div className="flex items-end gap-4">
                    {/* Avatar Skeleton */}
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 animate-pulse" />
                    </div>

                    {/* Info Skeleton */}
                    <div className="mb-2 space-y-2">
                      <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                  </div>

                  {/* Actions Skeleton */}
                  <div className="flex gap-3 mb-2">
                    <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-20 bg-gray-100 rounded-lg animate-pulse mx-1" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 md:gap-6">
              {/* Left Column Skeleton */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-64 animate-pulse" />
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-40 animate-pulse" />
              </div>

              {/* Right Column Skeleton */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-32 animate-pulse" />
                {[1, 2].map((i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }



  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <Header />
      <main className="flex-1 pt-16">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-0 py-6 space-y-4">
          <ProfileHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onEditProfile={isOwnProfile ? () => openModal("editProfile") : null}
            name={displayName}
            subtitle={subtitle}
            isOwnProfile={isOwnProfile}
            userId={profileUser?.id}
            avatar={profileUser?.avatar}
          />

          {activeTab === "Bài viết" && (
            <section className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 md:gap-6 items-start">
              <div className="space-y-4">
                <ProfileIntro
                  bio={displayBio}
                  overviewItems={overviewItems}
                  interests={interests}
                  onEditBio={isOwnProfile ? () => openModal("editBio") : null}
                  onEditDetails={isOwnProfile ? () => openModal("editDetails") : null}
                  onEditInterests={isOwnProfile ? () => openModal("editInterests") : null}
                  isOwnProfile={isOwnProfile}
                />
                <ProfilePhotos userId={profileUser?.id} />
                <ProfileFriendsWidget userId={profileUser?.id} onTabChange={setActiveTab} />
              </div>
              <ProfilePosts userId={userId} />
            </section>
          )}

          {activeTab === "Giới thiệu" && (
            <section className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 md:gap-6">
              <div className="space-y-4">
                <ProfileIntro
                  bio={displayBio}
                  overviewItems={overviewItems}
                  interests={interests}
                  onEditBio={isOwnProfile ? () => openModal("editBio") : null}
                  onEditDetails={isOwnProfile ? () => openModal("editDetails") : null}
                  onEditInterests={isOwnProfile ? () => openModal("editInterests") : null}
                  isOwnProfile={isOwnProfile}
                />
              </div>
              <ProfileAboutDetails
                sections={aboutSections}
                onEditSection={isOwnProfile ? (section) =>
                  openModal("editAboutSection", { section }) : null}
                isOwnProfile={isOwnProfile}
              />
            </section>
          )}

          {activeTab === "Bạn bè" && <ProfileFriends userId={userId} />}

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

      {isOwnProfile && (
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
      )}
    </div>
  );
};

export default Profile;
