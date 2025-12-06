import React from 'react';

const UserSkeleton = () => {
    return (
        <div className="bg-white p-4 flex items-center gap-4 border-b border-gray-100">
            {/* Avatar Skeleton */}
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />

            {/* Info Skeleton */}
            <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Actions Skeleton */}
            <div className="flex gap-2">
                <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
            </div>
        </div>
    );
};

export default UserSkeleton;
