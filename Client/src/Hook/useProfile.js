import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import { useNavigate } from "react-router-dom";

export const useProfile = () => {
  const navigate = useNavigate();

  return async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      // console.log(user);

      if (user?._id && user?.email && user?.name) {
        // console.log("profile");
        return;
      }

      const response = await axios.get(BASE_URL + "/auth/user", {
        withCredentials: true,
      });
      // console.log(response);
      const userData = response.data.user;
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (err) {
      console.log(err.message);
      navigate("/auth");
    }
  };
};
