import React, { useEffect, useState } from "react";
import { CiSettings } from "react-icons/ci";
import dataPack from "../../data";
const CustomSettings = ({ onOptionChange, onFontOptionChange }) => {
  const [isClicked, setClick] = useState(false);
  const [fontdata, setFontData] = useState([]);
  const [themeData, setTheme] = useState([]);
  useEffect(() => {
    const fData = dataPack.fontSizes;
    const tData = dataPack.Theme;
    setFontData(fData);
    setTheme(tData);
  }, []);

  const onThemeChange = (e) => {
    console.log(e.target.value);
    onOptionChange(e.target.value);
  };
  const onFontChange = (e) => {
    console.log(e.target.value);
    onFontOptionChange(e.target.value);
  };

  return (
    <>
      <select onChange={onThemeChange} className="cursor-pointer m-2">
        {themeData.map((option) => {
          return (
            <option
              onChange={onThemeChange}
              key={option.id}
              value={option.theme}
            >
              {option.theme}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default CustomSettings;
