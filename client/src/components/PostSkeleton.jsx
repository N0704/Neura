import React from "react";

const PostSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Image Placeholder (optional) */}
            <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse mb-4" />

            {/* Footer Actions */}
            <div className="flex justify-between pt-2 border-t border-gray-100">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
};

export default PostSkeleton;
