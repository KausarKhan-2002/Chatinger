import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import sound from "../Assets/notification.mp3";

export const useSendMessage = () => {
  return async (text, recieverId, isSound) => {
    try {
      // console.log(text, recieverId);

      const response = await axios.post(
        BASE_URL + `/message/send/${recieverId}`,
        { text },
        { withCredentials: true }
      );
      console.log(isSound);
      const notification = new Audio(sound);
      isSound && notification.play();

      //   console.log(response);
    } catch (err) {
      console.log(err.message);
    }
  };
};
