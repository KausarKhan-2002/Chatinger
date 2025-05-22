import { Route, Routes } from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import { Toaster } from "react-hot-toast";
import PanelContainer from "./Components/Layouts/PanelContainer";
import { useProfile } from "./Hook/useProfile";
import { useEffect } from "react";

const App = () => {
  const profile =useProfile()

  useEffect(() => {
    profile()
  }, [])

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<PanelContainer />} />
      </Routes>
    </div>
  );
};

export default App;
