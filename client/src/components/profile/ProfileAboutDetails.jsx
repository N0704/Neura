import React from "react";
const ProfileAboutDetails = ({ sections = [], onEditSection }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              {section.title}
            </h3>
            <button
              className="text-xs font-medium text-gray-600 hover:underline cursor-pointer"
              onClick={() => onEditSection?.(section.title)}
            >
              Chỉnh sửa
            </button>
          </div>

          <div className="space-y-2">
            {section.items.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors"
              >
                <item.icon className="text-gray-500 mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-gray-900">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {section.action && (
            <button
              className="text-xs font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={() => onEditSection?.(section.title)}
            >
              {section.action}
            </button>
          )}

          {section !== sections[sections.length - 1] && (
            <hr className="border-gray-100 pt-1" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProfileAboutDetails;


