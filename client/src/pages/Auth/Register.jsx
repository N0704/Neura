import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Google from "../../assets/google-logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors((prev) => ({ ...prev, [id]: "", general: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên của bạn";
    if (!formData.date.trim()) newErrors.date = "Vui lí nhập ngày sinh";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!formData.password.trim())
      newErrors.password = "Vui lòng nhập mật khẩu";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    alert("Đăng ký thành công!");
    navigate("/login");
  };

  return (
    <div className="py-4">
      <div className="w-full max-w-md bg-white px-10 py-8 rounded-xl shadow-xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-black to-gray-700 rounded-t-xl"></div>

        <div className="text-center mb-4">
          <h1 className="text-2xl font-semibold text-black mb-2">
            Tạo Tài Khoản Mới
          </h1>
          <p className="text-sm text-gray-600">
            Tham gia <span className="font-semibold">Neura</span> ngay hôm nay
            và kết nối với mọi người!
          </p>
        </div>

        <button
          type="button"
          className="w-full py-2 border border-gray-300 text-sm cursor-pointer bg-white rounded-lg hover:opacity-80 mb-4"
        >
          <div className="flex items-center justify-center">
            <img src={Google} alt="google" className="w-6 h-6 mr-2" />
            <span className="text-gray-500 font-medium">
              Tạo tài khoản bằng Google
            </span>
          </div>
        </button>

        <div className="text-center text-xs text-gray-500 relative mb-3">
          <span className="absolute left-0 top-1/2 w-1/3 h-px bg-gray-300"></span>
          <span className="absolute right-0 top-1/2 w-1/3 h-px bg-gray-300"></span>
          Hoặc tạo tài khoản với
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-gray-800 font-medium text-sm"
            >
              Họ và tên
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tên của bạn"
              className={`w-full px-4 text-sm py-2.5 border rounded focus:outline-none focus:ring-2 focus:ring-black ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="date"
              className="block mb-2 text-gray-800 font-medium text-sm"
            >
              Ngày sinh
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 text-sm py-2.5 border rounded focus:outline-none focus:ring-2 focus:ring-black ${
                errors.date ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1">{errors.date}</p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-gray-800 font-medium text-sm"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className={`w-full px-4 text-sm py-2.5 border rounded focus:outline-none focus:ring-2 focus:ring-black ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-2">{errors.email}</p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-gray-800 font-medium text-sm"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className={`w-full px-4 text-sm py-2.5 border rounded focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.password ? "border-red-400" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-2">{errors.password}</p>
            )}
          </div>

          <div className="text-xs text-gray-800 mb-5">
            Bằng cách nhấp vào Đăng ký, bạn đồng ý với
            <span className="font-semibold cursor-pointer hover:underline ml-1">
              Điều khoản
            </span>
            ,
            <span className="font-semibold cursor-pointer hover:underline mx-1">
              Chính sách quyền riêng tư
            </span>{" "}
            và
            <span className="font-semibold cursor-pointer hover:underline mx-1">
              Chính sách cookie
            </span>{" "}
            của chúng tôi.
          </div>

          <button
            type="submit"
            className="w-full py-2 cursor-pointer bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            ĐĂNG KÝ
          </button>

          <div className="text-center text-sm mt-5 text-gray-600">
            Bạn đã có tài khoản?{" "}
            <Link
              to={"/login"}
              className="text-black font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
