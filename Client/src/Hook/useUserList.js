import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import { useUsers } from "../Context/UserContext";

const useUserList = () => {
  const { setUsers } = useUsers();

  return async () => {
    try {
      const response = await axios.get(BASE_URL + "/auth/user-list", {
        withCredentials: true,
      });
    //   console.log(response);
      setUsers(response.data?.users || []);
    } catch (err) {
      console.log(err.message);
    }
  };
};

export default useUserList;
