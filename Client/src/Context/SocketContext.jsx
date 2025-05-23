import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../Utils/constants";
import { io } from "socket.io-client";

const socketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState(null);
  const [offline, setOffline] = useState([]);
  const profile = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (profile) {
      const socket = io(BASE_URL, {
        query: {
          transports: ['websocket'],
          secure: true,
          userId: profile._id,
        },
      });

      socket.on("onlineStatus", (users) => users && setOnlineUserIds(users));
      socket.on("offline", (lastSeens) => setOffline(lastSeens));
      setSocket(socket);
    }
  }, []);

  return (
    <socketContext.Provider value={{ socket, onlineUserIds, offline }}>
      {children}
    </socketContext.Provider>
  );
};

export const useSocket = () => useContext(socketContext);

export default SocketProvider;
