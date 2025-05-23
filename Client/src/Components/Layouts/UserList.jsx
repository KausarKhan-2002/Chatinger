import { useSocket } from "../../Context/SocketContext";
import { useUsers } from "../../Context/UserContext";
import { useMessages } from "../../Hook/useMessages";
import useUserList from "../../Hook/useUserList";
import { useEffect, useState } from "react";

function UserList({ onClose }) {
  const { users, setSelectedUser } = useUsers();
  const userList = useUserList();
  const [active, setActive] = useState("");
  const allMessages = useMessages();
  const { onlineUserIds, offline } = useSocket();
  const [renderNotification, setRenderNotification] = useState(false);
  const msgAlertArr = JSON.parse(localStorage.getItem("msgAlert"));

  // console.log(msgAlertArr);

  const handleClick = (user) => {
    allMessages(user._id);
    onClose();
    setActive(user._id);
    setSelectedUser(user);

    if (msgAlertArr && msgAlertArr?.length) {
      const filterMsgAlert = msgAlertArr.filter(
        (msg) => msg.senderId !== user._id
      );
      localStorage.setItem("msgAlert", JSON.stringify(filterMsgAlert));
    }
  };

  function formatLastSeen(lastSeen) {
    const now = new Date();
    const seenTime = new Date(lastSeen);
    const diffMs = now - seenTime;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hr ago`;
    if (diffDay === 1) return "Yesterday";
    return seenTime.toLocaleString();
  }

  useEffect(() => {
    userList();
  }, []);

  useEffect(() => {
    setRenderNotification(!renderNotification);
  }, [msgAlertArr]);

  // console.log(renderNotification);

  if (!users)
    return <h2 className="text-white text-center mt-4">Loading...</h2>;

  return (
    <div className="text-white overflow-y-auto">
      {users.map((user) => (
        <div
          onClick={() => handleClick(user)}
          key={user._id}
          className={`py-3 px-4 hover:bg-slate-900 ${
            active === user._id && "bg-black/40"
          } border-b border-[#2a3942] cursor-pointer transition-all duration-200 flex items-center justify-between`}
        >
          <h3 className="text-sm font-medium flex gap-2 items-center">
            {user.name}

            {onlineUserIds && onlineUserIds.includes(user._id) && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </h3>

          <div className="flex gap-2 items-center px-5">
            {msgAlertArr &&
              msgAlertArr.map(
                (msg, ind) =>
                  msg.senderId === user._id && (
                    <p
                      key={ind}
                      className="absolute bg-lime-600 w-5 min-h-5 text-sm font-medium rounded-full flex justify-center items-center"
                    >
                      {msg.count}
                    </p>
                  )
              )}
            {offline.map(
              (status) =>
                status.userId === user._id && (
                  <p key={status.userId} className="text-xs text-slate-500">
                    {formatLastSeen(status.lastSeen)}
                  </p>
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;
