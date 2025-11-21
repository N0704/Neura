import React, { useState, useEffect, useRef } from "react";
import { IoCloseOutline, IoSearchOutline, IoTimeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { contacts } from "../assets/assets";
import { Link } from "react-router-dom";

const SearchModal = ({ isOpen, onClose }) => {
  const posts = useSelector((state) => state.posts.posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, people, posts
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, [isOpen]);

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

  const saveToRecent = (query, type) => {
    if (!query.trim()) return;
    const newSearch = { query, type, timestamp: Date.now() };
    const updated = [
      newSearch,
      ...recentSearches.filter((s) => s.query !== query),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const filteredPeople = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(
    (post) =>
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults =
    searchQuery.trim() &&
    (filteredPeople.length > 0 || filteredPosts.length > 0);

  const showRecent = !searchQuery.trim() && recentSearches.length > 0;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
              <IoSearchOutline size={20} className="text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm trên Neura..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-900"
              />
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
            >
              <IoCloseOutline size={20} />
            </button>
          </div>

          {/* Tabs */}
          {searchQuery.trim() && (
            <div className="flex items-center gap-1 mt-3">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer ${
                  activeTab === "all"
                    ? "bg-gray-100 text-gray-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab("people")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer ${
                  activeTab === "people"
                    ? "bg-gray-100 text-gray-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Người ({filteredPeople.length})
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition cursor-pointer ${
                  activeTab === "posts"
                    ? "bg-gray-100 text-gray-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Bài viết ({filteredPosts.length})
              </button>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {showRecent && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Tìm kiếm gần đây
                </h3>
                <button
                  onClick={clearRecent}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(search.query);
                      setActiveTab(search.type === "people" ? "people" : "posts");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <IoTimeOutline size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{search.query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchQuery.trim() && !hasResults && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">
                Không tìm thấy kết quả cho "{searchQuery}"
              </p>
            </div>
          )}

          {searchQuery.trim() && hasResults && (
            <div className="space-y-6">
              {/* People Results */}
              {(activeTab === "all" || activeTab === "people") &&
                filteredPeople.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Người
                    </h3>
                    <div className="space-y-2">
                      {filteredPeople.map((person) => (
                        <Link
                          key={person.id}
                          to="/profile"
                          onClick={() => {
                            saveToRecent(searchQuery, "people");
                            onClose();
                          }}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50"
                        >
                          <img
                            src={person.avatar}
                            alt={person.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {person.name}
                            </p>
                            <p className="text-xs text-gray-500">Bạn bè</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              {/* Posts Results */}
              {(activeTab === "all" || activeTab === "posts") &&
                filteredPosts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Bài viết
                    </h3>
                    <div className="space-y-3">
                      {filteredPosts.slice(0, 5).map((post) => (
                        <div
                          key={post.id}
                          onClick={() => {
                            saveToRecent(searchQuery, "posts");
                            onClose();
                          }}
                          className="px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <img
                              src={post.user.avatar}
                              alt={post.user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs font-semibold text-gray-900">
                              {post.user.name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {!searchQuery.trim() && !showRecent && (
            <div className="text-center py-12">
              <IoSearchOutline size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Tìm kiếm bạn bè, bài viết và nhiều hơn nữa
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

