import { Avatar, Button, Drawer, Dropdown, Layout, theme } from "antd";
import React, { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../config";
import { useNavigate } from "react-router-dom";

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

const MyHeader = (props) => {
    const navigate = useNavigate();
    const { username, token } = useSelector((state) => state.auth);
    const { rTitle } = useSelector((state) => state.title);

    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const onClick = async ({ key }) => {
        if (key === "2") {
            await axios
                .delete(baseUrl + "/users/logout", { withCredentials: true })
                .then(() => {
                    navigate("/login");
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    return (
        <div>
            {/* <Header>
                <div className="h-[60px] bg-slate-300 flex items-center justify-between px-5">
                    <div className="flex items-center gap-5">
                        <div className="md:hidden text-2xl">
                            {React.createElement(
                                collapsed
                                    ? MenuFoldOutlined
                                    : MenuUnfoldOutlined,
                                {
                                    className: "trigger",
                                    onClick: () => {
                                        showDrawer();
                                        setCollapsed(!collapsed);
                                        props.setClickTombol(collapsed);
                                    },
                                }
                            )}
                        </div>

                        <div className="font-semibold text-3xl pb-[7px]">
                            {rTitle}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <span className="pr-3">Hi, {username}</span>
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
            </Header> */}
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
            <Drawer
                title="PGC Resto"
                placement="left"
                onClose={onClose}
                open={open}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </div>
    );
};

export default MyHeader;
