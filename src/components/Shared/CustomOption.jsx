import React, { useEffect, useState } from "react";
import "../../data";
import dataPack from "../../data";
export const CustomOption = () => {
  const [options, setOption] = useState([]);

  useEffect(() => {
    const data = dataPack.languageOptions;
    setOption(data);
  }, []);
  const handleChange = (e) => {
    console.log(e.target.value);
  };
  return (
    <>
      <select onChange={handleChange} className="cursor-pointer">
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
    </>
  );
};
