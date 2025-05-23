import React, { useEffect, useRef, useState } from "react";
import { useUsers } from "../../Context/UserContext";
import { useSendMessage } from "../../Hook/useSendMessage";
import moment from "moment";
import { motion } from "framer-motion";
import { useSocket } from "../../Context/SocketContext";
import recieveNoti from "../../Assets/recieve.mp3";
import { HiSpeakerWave } from "react-icons/hi2";
import { HiSpeakerXMark } from "react-icons/hi2";

function RightPanel() {
  const [text, setText] = useState("");
  const { selectedUser, messages } = useUsers();
  const [allMessages, setAllMessages] = useState([]);
  const sendMessage = useSendMessage();
  const profile = JSON.parse(localStorage.getItem("userData"));
  const { socket } = useSocket();
  const lastMsgRef = useRef();
  const [isSound, setIsSound] = useState(true);

  // console.log("charts:", messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(text, selectedUser._id, isSound);
    //     console.log(allMessages);

    // if (profile && selectedUser?._id) {
    //   socket.emit("userIds", {
    //     senderId: profile._id,
    //     recieverId: selectedUser._id,
    //   });
    // }

    const senderNewMsg = {
      senderId: profile._id,
      recieverId: selectedUser._id,
      text,
    };
    setAllMessages((prev) => [...prev, senderNewMsg]);
    setText("");
  };

  useEffect(() => {
    if (messages) {
      setAllMessages(messages);
    }
  }, [messages]);

  const handleNewMsg = (newMsg) => {
    // const sound = new Audio(recieveNoti)
    // sound.play()

    const msgAlert = JSON.parse(localStorage.getItem("msgAlert"));

    if (msgAlert && msgAlert.length) {
      let updatedMsgAlert;

      const existingInd = msgAlert.findIndex(
        (msg) => msg.senderId === newMsg.senderId
      );

      if (existingInd !== -1) {
        updatedMsgAlert = msgAlert.map((msg, ind) =>
          ind === existingInd
            ? { ...msg, count: msg.count + 1, text: (msg.text = newMsg.text) }
            : msg
        );
      } else {
        updatedMsgAlert = [...msgAlert, { ...newMsg, count: 1 }];
      }

      console.log("from newMsg:", newMsg.senderId);
      console.log("from msgAlert:", newMsg.senderId);

      localStorage.setItem("msgAlert", JSON.stringify(updatedMsgAlert));
    } else {
      const newMsgAlert = [
        {
          senderId: newMsg.senderId,
          recieverId: newMsg.recieverId,
          text: newMsg.text,
          count: 1,
        },
      ];

      localStorage.setItem("msgAlert", JSON.stringify(newMsgAlert));

      // console.log(msgAlert);
    }

    // console.log(newMsg);

    setAllMessages((prev) => [...prev, newMsg]);

    // socket.on("msgAlert", (msg) => {
    //   console.log("msgAlert", msg);
    // }
  };

  useEffect(() => {
    if (socket) {
      socket.on("newMsg", handleNewMsg);
      socket.on("msgAlert", (msg) => console.log(msg));
    }

    return () => {
      socket && socket.off("newMsg");
      socket && socket.off("msgAlert");
    };
  }, [socket]);

  useEffect(() => {
    setTimeout(() => {
      if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({ behaviour: "smooth" });
      }
    }, 100);
  }, [allMessages]);

  if (!selectedUser) return <h2 className="text-white p-4">Hii there</h2>;

  return (
    <div className="w-full flex flex-col bg-slate-950 text-white h-full">
      <h2 className="bg-slate-900/40 p-3 text-lg font-semibold border-b border-slate-800">
        {selectedUser.name}
      </h2>

      <div className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {allMessages.length > 0 ? (
          allMessages.map((msg, ind) => {
            const isSender = msg.recieverId === selectedUser._id;

            return (
              <motion.div
                key={ind}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                ref={lastMsgRef}
              >
                <div
                  className={`max-w-[80%] md:max-w-[60%] lg:max-w-[40%] p-3 rounded-lg shadow-md ${
                    isSender
                      ? "bg-teal-700 text-white rounded-tr-none"
                      : "bg-slate-800 text-slate-100 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm mb-1">{msg.text}</p>
                  <div className="text-xs text-slate-300 flex justify-end gap-2">
                    <span>{moment(msg.timestamp).format("MMM D, YYYY")}</span>
                    <span>{moment(msg.timestamp).format("hh:mm A")}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-slate-400">No message yet</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3 flex items-center justify-center gap-3 border-t border-slate-800"
      >
        <input
          type="text"
          placeholder="Typing..."
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="bg-slate-900 w-full lg:w-[80%] rounded-md py-2 px-3 text-sm outline-none text-white placeholder-slate-400"
        />
        <button className="text-sm font-medium bg-teal-800 hover:bg-teal-700 w-20 py-2 rounded-md transition-all">
          Send
        </button>
      </form>

      <button
        onClick={() => setIsSound(!isSound)}
        className="text-xl text-slate-500 absolute top-4 right-2 cursor-pointer"
      >
        {isSound ? <HiSpeakerWave /> : <HiSpeakerXMark />}
      </button>
    </div>
  );
}

export default RightPanel;
