import { Button } from "antd";
import React from "react";

const MyButton = (props) => {
    return (
        <div>
            <Button
                htmlType={props.submit}
                className="bg-primary text-white hover:text-white 
            hover:bg-gray-600 rounded-full w-32 h-10 md:text-[15px] border-none font-poppins"
            >
                {props.caption}
            </Button>
        </div>
    );
};

export default MyButton;
