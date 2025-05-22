import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import { useUsers } from "../Context/UserContext";

export const useMessages = () => {
  const { setMessages } = useUsers();

  return async (recieverId) => {
    try {
      const response = await axios.get(
        BASE_URL + `/message/all/${recieverId}`,
        { withCredentials: true }
      );

      // console.log(response);
      setMessages(response.data?.messages || []);
    } catch (err) {
      console.log(err.message);
    }
  };
};
