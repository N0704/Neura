import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Google from "../../assets/google-logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors((prev) => ({ ...prev, [id]: "", general: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
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

    if (
      formData.email !== "nghiabd@gmail.com" ||
      formData.password !== "123456"
    ) {
      setErrors({
        general: "Email hoặc mật khẩu không chính xác, vui lòng thử lại",
      });
    } else {
      setErrors({});
      navigate("/");
    }
  };

  return (
    <div className="w-full max-w-md bg-white px-10 py-8 rounded-xl shadow-xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-black to-gray-700 rounded-t-xl"></div>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold text-black mb-2">Đăng Nhập</h1>
        <p className="text-sm text-gray-600">
          Chào mừng đến với <span className="font-semibold">Neura</span>, đăng
          nhập để tiếp tục
        </p>
      </div>

      <button
        type="button"
        className="w-full py-2 border border-gray-300 text-sm cursor-pointer bg-white rounded-lg hover:opacity-80 mb-4"
      >
        <div className="flex items-center justify-center">
          <img src={Google} alt="google" className="w-6 h-6 mr-2" />
          <span className="text-gray-500 font-medium">
            Đăng nhập với Google
          </span>
        </div>
      </button>

      <div className="text-center text-xs text-gray-500 relative mb-3">
        <span className="absolute left-0 top-1/2 w-1/3 h-px bg-gray-300"></span>
        <span className="absolute right-0 top-1/2 w-1/3 h-px bg-gray-300"></span>
        Hoặc đăng nhập bằng
      </div>

      <form onSubmit={handleSubmit}>
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
              errors.email || errors.general
                ? "border-red-400"
                : "border-gray-300"
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
                errors.password || errors.general
                  ? "border-red-400"
                  : "border-gray-300"
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
          {errors.general && (
            <p className="text-sm text-red-600 mt-2">{errors.general}</p>
          )}
        </div>

        <div className="flex justify-between items-center text-sm mb-5 text-gray-800">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-black" />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <a className="hover:underline cursor-pointer">Quên mật khẩu?</a>
        </div>

        <button
          type="submit"
          className="w-full py-2 cursor-pointer bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
        >
          ĐĂNG NHẬP
        </button>

        <div className="text-center text-sm mt-5 text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to={"/register"}
            className="text-black font-medium hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </div>
  );
}
