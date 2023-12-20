import React from "react";
import { useSandpackNavigation } from "@codesandbox/sandpack-react";
import { BiRefresh } from 'react-icons/bi';

const CustomRefreshButton = () => {
    const { refresh } = useSandpackNavigation();

    return (
        <div onClick={() => refresh()} >
            <BiRefresh color="black" size={30} className='cursor-pointer' />
        </div>
    );
};

export default CustomRefreshButton;
