import React, { useState, useEffect, useRef } from "react";
import { IoCloseOutline, IoSearchOutline, IoTimeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { usersAPI } from "../api/usersAPI";
import UserSkeleton from "./UserSkeleton";

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } else {
      // Reset when modal closes
      setSearchQuery("");
      setUserResults([]);
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

  // Debounced search - only users
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUserResults([]);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const usersResponse = await usersAPI.searchUsers(searchQuery);
        setUserResults(usersResponse.data.data || usersResponse.data || []);
      } catch (error) {
        console.error('Error searching:', error);
        setUserResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const saveToRecent = (query) => {
    if (!query.trim()) return;
    const newSearch = { query, type: 'people', timestamp: Date.now() };
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveToRecent(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      saveToRecent(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const hasResults = userResults.length > 0;
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
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                <IoSearchOutline size={20} className="text-gray-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm người dùng..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-900"
                />
              </div>
              <button
                onClick={onClose}
                type="button"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Recent Searches */}
          {showRecent && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Tìm kiếm gần đây
                </h3>
                <button
                  onClick={clearRecent}
                  className="text-xs text-gray-600 hover:underline cursor-pointer"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      saveToRecent(search.query);
                      navigate(`/search?q=${encodeURIComponent(search.query)}`);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left cursor-pointer"
                  >
                    <IoTimeOutline size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{search.query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && searchQuery.trim() && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <UserSkeleton key={i} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && searchQuery.trim() && !hasResults && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500 text-sm mt-2">
                Không tìm thấy kết quả cho "{searchQuery}"
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && searchQuery.trim() && hasResults && (
            <div>
              <div className="space-y-2">
                {userResults.slice(0, 5).map((person) => (
                  <Link
                    key={person.id}
                    to={`/profile/${person.id}`}
                    onClick={() => {
                      saveToRecent(searchQuery);
                      onClose();
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={person.avatar || '/default-avatar.png'}
                      alt={person.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {person.username}
                      </p>
                      {person.email && (
                        <p className="text-xs text-gray-500">{person.email}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Button - Always show when there are results */}
              <button
                onClick={handleViewAllResults}
                className="w-full mt-4 py-2.5 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Xem tất cả kết quả
              </button>
            </div>
          )}

          {/* Empty State */}
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
