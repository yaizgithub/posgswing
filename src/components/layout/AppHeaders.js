import { Avatar, Dropdown, Layout, theme } from "antd";
import React, { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { baseUrl } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from 'universal-cookie';

const { Header } = Layout;

const items = [
    {
        label: "Profile",
        key: "1",
    },
    {
        label: "Logout",
        key: "2",
    },
];

const AppHeaders = (props) => {
    const cookies = new Cookies();
    const navigate = useNavigate();

    const { username } = useSelector((state) => state.auth);
    const { rTitle } = useSelector((state) => state.title);

    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onClick = async ({ key }) => {
        if (key === "2") {
            await axios
                .delete(baseUrl + "/users/logout", { withCredentials: true })
                .then(() => {
                    // Hapus cookie dengan nama tertentu
                    cookies.remove('accessToken');
                    navigate("/login");
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <div>
            {" "}
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        {React.createElement(
                            collapsed ? MenuFoldOutlined : MenuUnfoldOutlined,
                            {
                                className: "trigger",
                                onClick: () => {
                                    setCollapsed(!collapsed);
                                    props.setClickTombol(collapsed);
                                    props.openShowDrawer(true);
                                },
                            }
                        )}
                        <span className="mb-5 font-semibold text-[20px]">
                            {rTitle}
                        </span>
                    </div>
                    <div className="pr-5">
                        <span className="pr-2">Hi, {username}</span>
                        <Dropdown
                            trigger={["click"]}
                            menu={{
                                items,
                                onClick,
                            }}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Avatar
                                    icon={<UserOutlined />}
                                    className="mb-1"
                                />
                            </a>
                        </Dropdown>
                    </div>
                </div>
            </Header>
        </div>
    );
};

export default AppHeaders;
