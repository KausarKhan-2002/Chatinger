import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../Utils/constants";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  return async (userInfo, isSignup, setIsLogin) => {
    try {
      const endPoint = isSignup ? "/auth/signup" : "/auth/login";

      setIsLogin(true);
      const response = await axios.post(BASE_URL + endPoint, userInfo, {
        withCredentials: true,
      });
    //   console.log(response.data);
      const notify = isSignup
        ? "You are signed up successfully"
        : "You are logged in successfully";
      toast.success(notify);

      const user = response.data.user;

      const localObj = { id: user.id, name: user.name, email: user.email };

      localStorage.setItem("userData", JSON.stringify(localObj));
      navigate("/")
    } catch (err) {
      console.log(err.message);
      toast.error(err.data?.response?.message || "Internal server error");
    } finally {
      setIsLogin(false);
    }
  };
};
