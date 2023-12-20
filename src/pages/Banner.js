import React from "react";
import { CustomOption } from "../components/Shared/CustomOption.jsx";
import SandpackResembler from "../components/SandpackResembler.jsx";

function Banner() {
  return (
    <div>
      <SandpackResembler language={"react"}>
        <CustomOption />
      </SandpackResembler>
    </div>
  );
}

export default Banner;
