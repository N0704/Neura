import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usersAPI } from '../api/usersAPI';
import { postsAPI } from '../api/postsAPI';
import Header from '../components/Header';
import UserCard from '../components/UserCard';
import PostCard from '../components/PostCard';
import UserSkeleton from '../components/UserSkeleton';
import PostSkeleton from '../components/PostSkeleton';
import { IoSearchOutline, IoPeopleOutline, IoDocumentTextOutline, IoAlbumsOutline } from 'react-icons/io5';

const SearchUsers = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q') || '';
    const initialFilter = queryParams.get('filter') || 'all'; // Get filter from URL

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [userResults, setUserResults] = useState([]);
    const [postResults, setPostResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all'); // Always start with 'all'

    // Load suggestions on mount
    useEffect(() => {
        loadSuggestions();
    }, []);

    // Search when URL query changes
    useEffect(() => {
        console.log('URL changed - Query:', initialQuery, 'Filter:', initialFilter);

        // Set filter from URL
        if (initialFilter) {
            setActiveFilter(initialFilter);
        }

        // Perform search if query exists
        if (initialQuery) {
            setSearchQuery(initialQuery);
            handleSearch(null, initialQuery);
        }
    }, [location.search]); // Only depend on location.search

    const loadSuggestions = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getSuggestions();
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error loading suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e, query = searchQuery) => {
        if (e) e.preventDefault();
        if (!query.trim()) {
            setUserResults([]);
            setPostResults([]);
            return;
        }

        try {
            setLoading(true);

            // Search both users and posts
            const [usersResponse, postsResponse] = await Promise.all([
                usersAPI.searchUsers(query),
                postsAPI.searchPosts(query)
            ]);

            setUserResults(usersResponse.data.data || usersResponse.data || []);
            setPostResults(postsResponse.data.data || postsResponse.data || []);
        } catch (error) {
            console.error('Error searching:', error);
            setUserResults([]);
            setPostResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        if (!e.target.value.trim()) {
            setUserResults([]);
            setPostResults([]);
        }
    };

    const filteredResults = () => {
        if (activeFilter === 'users') return { users: userResults, posts: [] };
        if (activeFilter === 'posts') return { users: [], posts: postResults };
        return { users: userResults, posts: postResults };
    };

    const { users, posts } = filteredResults();
    const hasResults = users.length > 0 || posts.length > 0;
    const showResults = searchQuery.trim();

    return (
        <div className="flex flex-col h-screen bg-[#f0f2f5]">
            <Header />

            <main className="flex-1 pt-16 overflow-hidden">
                <div className="h-full grid grid-cols-1 lg:grid-cols-[320px_1fr]">
                    {/* Sidebar */}
                    <aside className="hidden lg:block bg-white shadow-sm overflow-y-auto">
                        <div className="p-3">
                            <h2 className="px-2 py-2 text-xl font-bold text-gray-900">
                                Tìm kiếm
                            </h2>

                            {/* Search Box */}
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
                                    <IoSearchOutline size={20} className="text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm trên Neura"
                                        value={searchQuery}
                                        onChange={handleInputChange}
                                        className="bg-transparent outline-none text-sm text-gray-900 flex-1 placeholder-gray-500"
                                    />
                                </div>
                            </form>

                            <h3 className="px-2 py-2 text-base font-semibold text-gray-900 border-t border-gray-200 mt-2 pt-4">
                                Bộ lọc tìm kiếm
                            </h3>

                            <div className="mt-2 space-y-1">
                                <button
                                    onClick={() => setActiveFilter('all')}
                                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition ${activeFilter === 'all'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <IoAlbumsOutline className="w-5 h-5" />
                                    <span className="font-medium">Tất cả</span>
                                </button>

                                <button
                                    onClick={() => setActiveFilter('users')}
                                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition ${activeFilter === 'users'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <IoPeopleOutline className="w-5 h-5" />
                                    <div className="flex-1 text-left">
                                        <span className="font-medium">Mọi người</span>
                                        {userResults.length > 0 && (
                                            <span className="ml-2 text-xs text-gray-500">
                                                ({userResults.length})
                                            </span>
                                        )}
                                    </div>
                                </button>

                                <button
                                    onClick={() => setActiveFilter('posts')}
                                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition ${activeFilter === 'posts'
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <IoDocumentTextOutline className="w-5 h-5" />
                                    <div className="flex-1 text-left">
                                        <span className="font-medium">Bài viết</span>
                                        {postResults.length > 0 && (
                                            <span className="ml-2 text-xs text-gray-500">
                                                ({postResults.length})
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Suggestions */}
                            {!showResults && suggestions.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <h3 className="px-2 py-2 text-sm font-semibold text-gray-600">
                                        Gợi ý kết bạn
                                    </h3>
                                    <p className="px-2 text-xs text-gray-500">
                                        {suggestions.length} người
                                    </p>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto px-40 pt-8 pb-10">
                        {/* Mobile Filters */}
                        {showResults && (
                            <div className="flex lg:hidden items-center gap-2 mb-4 overflow-x-auto pb-2 bg-white rounded-lg shadow-sm p-4">
                                <button
                                    onClick={() => setActiveFilter('all')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition ${activeFilter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Tất cả
                                </button>
                                <button
                                    onClick={() => setActiveFilter('users')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition ${activeFilter === 'users'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Mọi người ({userResults.length})
                                </button>
                                <button
                                    onClick={() => setActiveFilter('posts')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition ${activeFilter === 'posts'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Bài viết ({postResults.length})
                                </button>
                            </div>
                        )}

                        {/* Results */}
                        {loading ? (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Mọi người</h3>
                                    <div className="space-y-4">
                                        {[1, 2].map((i) => <UserSkeleton key={i} />)}
                                    </div>
                                </div>
                                <div>
                                    <div className="space-y-4">
                                        {[1, 2].map((i) => <PostSkeleton key={i} />)}
                                    </div>
                                </div>
                            </div>
                        ) : showResults ? (
                            <>
                                {!hasResults ? (
                                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                        <svg
                                            className="mx-auto h-16 w-16 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                                            Không tìm thấy kết quả
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Hãy thử tìm kiếm với từ khóa khác
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Users Results */}
                                        {users.length > 0 && (
                                            <div className="bg-white rounded-lg shadow-sm p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 ">
                                                    Mọi người
                                                </h3>
                                                <div className="space-y-1">
                                                    {users.map((user) => (
                                                        <UserCard
                                                            key={user.id}
                                                            user={user}
                                                            showFriendButton={true}
                                                            showFollowButton={true}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Posts Results */}
                                        {posts.length > 0 && (
                                            <div>
                                                <div className="space-y-4">
                                                    {posts.map((post) => (
                                                        <PostCard key={post.id} post={post} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Suggestions when no search */
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Gợi ý kết bạn
                                </h3>
                                {suggestions.length === 0 ? (
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
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                        <p className="mt-2 text-gray-600">Không có gợi ý nào</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {suggestions.map((user) => (
                                            <UserCard
                                                key={user.id}
                                                user={user}
                                                showFriendButton={true}
                                                showFollowButton={true}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SearchUsers;
