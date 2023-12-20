import React from "react";

import { Routes, Route } from "react-router-dom";
// import SandpackResembler from "./components/SandpackResembler";
import Banner from "./pages/Banner";
// import CustomRun from "./components/Shared/CustomRun";

const App = () => {
  return (
    <div className="m-6">
      <Routes>
        <Route path="/" element={<Banner />} />
      </Routes>
    </div>
  );
};

export default App;
