import { contacts } from "../assets/assets";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const Contacts = () => {
  return (
    <div className="px-3 py-3 text-[15px] text-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold mb-1">Người liên hệ</h2>
        <div className="flex items-center">
          <button className="p-1.5 text-gray-600 cursor-pointer">
            <IoSearchOutline size={18} />
          </button>
          <button className="p-1.5 text-gray-600 cursor-pointer">
            <HiOutlineDotsHorizontal size={22} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        {contacts.map((contact) => (
          <NavLink
            key={contact.id}
            className="flex items-center gap-3.5 rounded-xl hover:bg-gray-100 p-3"
          >
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <p>{contact.name}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
