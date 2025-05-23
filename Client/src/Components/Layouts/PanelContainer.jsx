import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";

function PanelContainer() {
  const [isSidebar, setIsSidebar] = useState(false);

  return (
    <div className="w-screen h-screen bg-slate-700 flex justify-center items-center px:2 md:px-10 text-white">
      <div className="relative flex w-full lg:w-[95%] h-[90vh] bg-slate-800 overflow-hidden">
        <SidebarToggle onOpen={() => setIsSidebar(true)} />
        <LeftPanel isSidebar={isSidebar} onClose={() => setIsSidebar(false)} />
        <RightPanel />
      </div>
    </div>
  );
}

function SidebarToggle({ onOpen }) {
  return (
    <div className="flex flex-col p-2 gap-3 bg-slate-900 text-xl lg:hidden">
      <RxHamburgerMenu onClick={onOpen} />
    </div>
  );
}

export default PanelContainer;
