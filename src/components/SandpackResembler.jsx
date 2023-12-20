import React, { useState, useEffect } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import CustomRefresh from "./Shared/CustomRefresh";
import "./styles/SandPackResembler.css";
import "../data";
import dataPack from "../data";
import CustomSettings from "./Shared/CustomSettings";

const SandpackResembler = ({ language, children }) => {
  const [changedTheme, setTheme] = useState();
  const [options, setOption] = useState([]);
  const [Lanvalue, selectedVal] = useState();
  const handleTheme = (themedata) => {
    console.log(themedata, "themeData");
    setTheme(themedata);
  };

  useEffect(() => {
    const data = dataPack.languageOptions;
    setOption(data);
  }, []);
  const handleChange = (e) => {
    const lowerCase = e.target.value;
    selectedVal(lowerCase.toLowerCase());
  };
  return (
    <>
      <SandpackProvider
        template={Lanvalue}
        theme={changedTheme}
        className="m-2"
      >
        <div className="flex  justify-between ">
          <div className="flex">
            <select onChange={handleChange} className="cursor-pointer m-2">
              {options.map((option) => {
                return (
                  <option
                    onChange={handleChange}
                    key={option.id}
                    value={option.value}
                  >
                    {option.value}
                  </option>
                );
              })}
            </select>
            <CustomRefresh />
          </div>
        </div>
        <SandpackLayout>
          <SandpackCodeEditor
            showLineNumbers={true}
            showInlineErrors
            wrapContent
            showRunButton={true}
          />
          <SandpackPreview
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
            autoSave="false"
            showRestartButton={true}
            fontSize={14}
          />
        </SandpackLayout>
        <CustomSettings onOptionChange={handleTheme} />
      </SandpackProvider>
    </>
  );
};

export default SandpackResembler;
