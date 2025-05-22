import UserList from "./UserList";
import { IoMdClose } from "react-icons/io";

function LeftPanel({ isSidebar, onClose }) {
  return (
    <div
      className={`absolute top-0 left-0 ${
        isSidebar ? "translate-x-0" : "-translate-x-full"
      } w-[45%] lg:w-[27%] lg:static lg:translate-x-0 h-full overflow-y-auto bg-slate-900 transition-all duration-300`}
    >
      <div className="flex justify-between items-center pr-2">
        <h2 className="text-xl p-3">Chatinger</h2>
        <IoMdClose onClick={onClose} className="text-xl" />
      </div>
      <UserList onClose={onClose} />
    </div>
  );
}

export default LeftPanel;
