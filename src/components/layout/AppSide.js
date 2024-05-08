import { Menu, Skeleton } from "antd";
import { Layout } from "antd";
import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useOneUserMenu } from "../../hooks/useUserMenuData";
import { useSelector } from "react-redux";
import "./styleLayout.css";
import * as Icons from "react-icons/fa6";
import axios from "axios";
import { baseUrl } from "../../config";
import {
  AppstoreOutlined,
  BellOutlined,
  TvOutlined,
  MoneyBillOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useOneUserMenuAplikasi } from "../../hooks/useUserMenuAplikasiData";

const { Sider } = Layout;
const { SubMenu } = Menu;

/* Your icon name from database data can now be passed as prop */
const DynamicFaIcon = ({ name }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    // Return a default one
    return <Icons.FaBeerMugEmpty />;
  }

  return <IconComponent />;
};

const getItem = (key, label, icon, children) => {
  return {
    key,
    label,
    icon,
    children,
  };
};

// const menuAdmin = [
//     getItem("1", <Link to="/">Dashboard</Link>, <AppstoreOutlined />),
//     // getItem("2", <Link to="/reservasi">Reservasi</Link>, <AppstoreOutlined />),
//     getItem("3", <Link to="/registrasi">Registrasi</Link>, <AppstoreOutlined />),
//     getItem("4", "Driving", <AppstoreOutlined />, [
//         getItem("5", <Link to="/listdrivingorder">List Driving Order</Link>),
//         // getItem("6", <Link to="/bahan">Bahan</Link>),
//         // getItem("7", <Link to="/resep">Resep</Link>),
//     ]),
//     getItem("6", "F & B", <AppstoreOutlined />, [
//         getItem("7", <Link to="/listrestoorder">List Resto Order</Link>),
//         // getItem("6", <Link to="/bahan">Bahan</Link>),
//         // getItem("7", <Link to="/resep">Resep</Link>),
//     ]),
//     getItem("8", <Link to="/revenue">Revenue</Link>, <AppstoreOutlined />),

//     getItem("20", "Package", <AppstoreOutlined />, [
//         getItem("21", <Link to="/package-driving">Package Driving</Link>),
//         getItem("22", <Link to="/package-resto">Package Resto</Link>),
//     ]),

//     getItem("100", <Link to="/setting">Setting</Link>, <SettingOutlined />),
// ];

const AppSide = (props) => {
  const navigate = useNavigate();
  const { userid } = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);

  ///HOOKs
  const { isLoading, data: dataOneUserMenuAplikasi } = useOneUserMenuAplikasi(userid, true);

  // useEffect(() => {
  //   const cobaMenu = async () => {
  //     await axios
  //       .get(baseUrl + `/usermenuaplikasi/nestedmenuoneuser?id_user=${userid}`)
  //       .then((res) => {
  //         setItems(res.data.data);
  //       })
  //       .catch((err) => console.log(err));
  //   };
  //   cobaMenu();
  // }, []);

  if (isLoading) {
    return <Skeleton active />;
  }

  // const menuAdmin = [
  // 	getItem("0", <Link to="/">Dashboard</Link>, <AppstoreOutlined />),
  // ];

  // if (dataOneUserMenu?.data) {
  // 	for (let item of dataOneUserMenu.data) {
  // 		menuAdmin.push(
  // 			getItem(
  // 				item.id,
  // 				<Link to={`/${item.kunci}`}>{item.label}</Link>,
  // 				<div>
  // 					<DynamicFaIcon name={item.icon} />
  // 				</div>
  // 			)
  // 		);
  // 	}
  // }

  // Fungsi untuk membuat menu item
  const renderMenuItem = (item) => (
    <Menu.Item
      key={item.key}
      icon={
        <div className="mr-1">
          <DynamicFaIcon name={item.icon} />
        </div>
      }
    >
      <Link to={item.key === "dashboard" ? "/" : `/${item.key}`}>
        {item.label}
      </Link>
    </Menu.Item>
  );

  // Fungsi untuk membuat submenu
  const renderSubMenu = (submenu) => (
    <SubMenu
      key={submenu.key}
      title={submenu.label}
      icon={
        <div className="mr-1">
          <DynamicFaIcon name={submenu.icon} />
        </div>
      }
    >
      {submenu.children.map((child) => renderMenuItem(child))}
    </SubMenu>
  );

  return (
    <div className="hidden md:block">
      <Sider trigger={null} collapsible collapsed={props.collapsed}>
        <div className="logo" />
        {/* <Menu
					theme="dark"
					style={{ height: "89.8vh" }}
					mode="inline"
					defaultSelectedKeys={["1"]}					
					items={items}
                    onClick={onClick}
				/> */}
        <Menu theme="dark" mode="inline" style={{ height: "89.8vh" }}>
          {dataOneUserMenuAplikasi?.data.map((item) =>
            item.children ? renderSubMenu(item) : renderMenuItem(item)
          )}
        </Menu>
      </Sider>
    </div>
  );
};

export default AppSide;
