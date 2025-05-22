import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const userContext = createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState(null);

  return (
    <userContext.Provider
      value={{ users, setUsers, selectedUser, setSelectedUser, messages, setMessages }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUsers = () => useContext(userContext);
export default UserProvider;
