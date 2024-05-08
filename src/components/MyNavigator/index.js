import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
    AppstoreOutlined,
    VideoCameraOutlined,
    SettingOutlined,
} from "@ant-design/icons";

const getItem = (key, label, icon, children) => {
    return {
        key,
        label,
        icon,
        children,
    };
};

const MyNavigator = ({ drawerClose }) => {
    const menuAdmin = [
        getItem("1", <Link to="/">Dashboard</Link>, <AppstoreOutlined />),
        getItem("2", "Master", <AppstoreOutlined />, [
            getItem("3", <Link to="/items">Items</Link>),
            getItem("4", <Link to="/bahan">Bahan</Link>),
            getItem("5", <Link to="/resep">Resep</Link>),
        ]),
        // getItem("2", "Golf", <AppstoreOutlined />, [
        //     getItem("3", "Club Operation", <AppstoreOutlined />, [
        //         getItem("4", "Maintenance", <AppstoreOutlined />, [
        //             getItem("5", <Link to="/categori">Categori</Link>),
        //             getItem("6", <Link to="/daymaster">Day Master</Link>),
        //             getItem("7", <Link to="/payment">Payment</Link>),
        //             getItem("8", <Link to="/card">Card / Other Payment</Link>),
        //             getItem("9", "Staff", <AppstoreOutlined />, [
        //                 getItem("10", <Link to="/cashier">Cashier</Link>),
        //                 getItem("11", <Link to="/caddy">Caddy</Link>),
        //             ]),
        //             getItem("12", <Link to="/golfservice">Golf Service</Link>),
        //             // getItem("13", <Link to="/package">Package</Link>),
        //             getItem("14", <Link to="/detailpackage">Package</Link>),
        //             getItem("15", <Link to="/buggy">Buggy</Link>),
        //             getItem("16", <Link to="/guestmaster">Guest Master</Link>),
        //             getItem(
        //                 "17",
        //                 <Link to="/additional">Additional Member Package</Link>
        //             ),
        //         ]),
        //         getItem("20", "Transactions", <AppstoreOutlined />, [
        //             getItem("21", <Link to="/opencashier">Open Cashier</Link>),
        //             getItem("22", <Link to="/caddy">Close Cashier</Link>),
        //             getItem("23", <Link to="/regisgolf">Registration</Link>),
        //         ]),
        //     ]),
        // ]),
        getItem("100", <Link to="/setting">Setting</Link>, <SettingOutlined />),
    ];

    return (
        <div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["2"]}
                items={menuAdmin}
                onClick={drawerClose}
            />
        </div>
    );
};

export default MyNavigator;
