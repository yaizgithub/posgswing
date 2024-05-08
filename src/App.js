import { Drawer, Layout, Menu, Skeleton, theme } from "antd";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./app.css";
import Login from "./containers/pages/auth/Login";
import Dashboard from "./containers/pages/dashboard/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "./config";
import axios from "axios";
import jwt_decode from "jwt-decode";
import AppHeaders from "./components/layout/AppHeaders";
import AppSide from "./components/layout/AppSide";
import { update } from "./features/authSlice";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";
import { notification } from "antd";
import Cookies from "universal-cookie";

import {
    AppstoreOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";

import PageReservasi from "./containers/pages/reservasi/PageReservasi";
import PageRegistrasi from "./containers/pages/registrasi/PageRegistrasi";
import PageListRestoOrder from "./containers/pages/resto/PageListRestoOrder";
import PageListDrivingOrder from "./containers/pages/driving/PageListDrivingOrder";
import PageDisplayDrivingOrder from "./containers/pages/driving/PageDisplayDrivingOrder";
import PageRevenue from "./containers/pages/revenue/PageRevenue";
import PagePackageDriving from "./containers/pages/packagedriving/PagePackageDriving";
import PagePackageResto from "./containers/pages/packageresto/PagePackageResto";
import PageSetting from "./containers/pages/setting/PageSetting";
import PageUserMenu from "./containers/pages/auth/PageUserMenu";
import PageUserRegistrasi from "./containers/pages/auth/PageUserRegistrasi";
import PageRevenueReport from "./containers/pages/revenue/PageRevenueReport";
import PageMatrixBay from "./containers/pages/matrix/PageMatrixBay";
import PagePrintBilling from "./containers/pages/billing/PagePrintBilling";
import PageMatrixReservasi from "./containers/pages/matrix/PageMatrixReservasi";
import PageRestoranRegistrasi from "./containers/pages/resto/PageRestoranRegistrasi";
import PageRestoranReservasi from "./containers/pages/resto/PageRestoranReservasi";
import PagePayment from "./containers/pages/payment/PagePayment";
import * as Icons from "react-icons/fa6";
import { getOneUserMenu } from "./features/users/usermenuSlice";
import PageAddHoursAndResto from "./containers/pages/addhours/PageAddHoursAndResto";
import PageTambahJam from "./containers/pages/addhours/PageTambahJam";
import PageTambahMakanan from "./containers/pages/addhours/PageTambahMakanan";
import PageLihatPesananRestoKu from "./containers/pages/addhours/PageLihatPesananRestoKu";
import PageDisplayTamu from "./containers/pages/driving/PageDisplayTamu";
import PageCekListPesananWaiter from "./containers/pages/addhours/PageCekListPesananWaiter";
import AddFormRestoranRegistrasi from "./components/resto/AddFormRestoranRegistrasi";
import PageCekListPesananRestoranWaiter from "./containers/pages/addhours/PageCekListPesananRestoranWaiter";
import PageRegistrasiVoucher from "./containers/pages/voucher/PageRegistrasiVoucher";
import PageClosing from "./containers/pages/closing/PageClosing";
import PageDaftarMenuOrderResto from "./containers/pages/resto/PageDaftarMenuOrderResto";

const queryClient = new QueryClient();

const { Content } = Layout;

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

const App = () => {
    const cookies = new Cookies();
    const [collapsed, setCollapsed] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userid, token } = useSelector((state) => state.auth);
    const dataUserMenu = useSelector((state) => state.usermenu);

    const [open, setOpen] = useState(false);
    const [lebarSider, setLebarSider] = useState();
    const [menuAdmin, setmenuAdmin] = useState([]);
    const [user, setUser] = useState(null);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const contentStyle = {
        margin: "24px 16px",
        padding: 24,
        minHeight: "70vh",
        height: "70vh",
        background: colorBgContainer,
        overFlow: "auto",
    };

    const openNotification = (title, body) => {
        api.info({
            message: title,
            description: body,
            placement: "topRight",
        });
    };

    useEffect(() => {
        refreshToken();
    }, []);

    useEffect(() => {
        generateToken();
        onMessage(messaging, (payload) => {
            console.log(payload);
            openNotification(
                payload.notification.title,
                payload.notification.body
            );
        });
    }, []);

    const tampilkanUserMenu = async () => {
        // console.log("--vvv----");
        // console.log(dataUserMenu.data);
        // console.log("--vvv----");
        setmenuAdmin([
            getItem("0", <Link to="/">Dashboard</Link>, <AppstoreOutlined />),
        ]);
        for (let item of dataUserMenu.data) {
            setmenuAdmin((old) => [
                ...old,
                getItem(
                    item.id,
                    <Link to={`/${item.kunci}`}>{item.label}</Link>,
                    <div>
                        <DynamicFaIcon name={item.icon} />
                    </div>
                ),
            ]);
        }
    };

    const showDrawer = (buka) => {
        if (lebarSider === 80) {
            setOpen(false);
        } else {
            setOpen(buka);
            tampilkanUserMenu();
        }
    };

    const onClose = () => {
        setOpen(false);
    };

    const getCollapse = (a) => {
        setCollapsed(a);
    };

    const refreshToken = () => {
        if (cookies.get("accessToken")) {
            const accToken = cookies.get("accessToken");
            const decoded = jwt_decode(accToken);

            console.log("cookies telah dibuat");
            console.log(decoded.userid);

            dispatch(
                update({
                    userid: decoded.userid,
                    username: decoded.first_name + " " + decoded.last_name,
                    role: decoded.role,
                    token: accToken,
                })
            );

            ///ambil data usermenu
            dispatch(getOneUserMenu(decoded.userid));
        } else {
            // console.log('cookies belum dibuat');
            navigate("/login");
        }

        // await axios
        //   .get(baseUrl + "/token", {
        //     withCredentials: true,
        //   })
        //   .then((res) => {
        //     // console.log(res.data);
        //     const decoded = jwt_decode(res.data.accessToken);
        //     // console.log(decoded);
        //     dispatch(
        //       update({
        //         userid: decoded.userid,
        //         username: decoded.first_name + " " + decoded.last_name,
        //         role: decoded.role,
        //         token: res.data.data.accessToken,
        //       })
        //     );

        //     ///ambil data usermenu
        //     dispatch(getOneUserMenu(decoded.userid));
        //   })
        //   .catch((err) => {
        //     if (err.response) {
        //       navigate("/login");
        //     }
        //   });
    };

    function useWindowSize() {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
            function updateSize() {
                setSize([window.innerWidth, window.innerHeight]);

                if (window.innerWidth <= 767) {
                    setLebarSider(0);
                    // console.log("A");
                } else if (
                    window.innerWidth > 767 &&
                    window.innerWidth <= 1109
                ) {
                    setLebarSider(80);
                    // console.log("B");
                } else {
                    setLebarSider(80);
                    // console.log("C");
                }
            }
            window.addEventListener("resize", updateSize);
            updateSize();
            return () => window.removeEventListener("resize", updateSize);
        }, []);
        return size;
    }

    const [height, width] = useWindowSize();

    return (
        <QueryClientProvider client={queryClient}>
            <Layout>
                {/* untuk menanpilkan pesan FCM */}
                {contextHolder}
                {/* END untuk menanpilkan pesan FCM */}

                {/* <Layout className="site-layout"> */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <Dashboard />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />

                    {/* PAGE RESERVASI */}
                    <Route
                        path="/reservasi"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PageMatrixReservasi />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE RESERVASI */}

                    {/* PAGE REGISTRASI */}
                    <Route
                        path="/registrasi"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        {/* <PageRegistrasi /> */}
                                        <PageMatrixBay />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE REGISTRASI */}

                    {/* PAGE LIST DRIVING ORDER */}
                    <Route
                        path="/listdrivingorder"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PageListDrivingOrder />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE LIST DRIVING ORDER */}

                    {/* PAGE LIST DRIVING ORDER UNTUK DISPLAY KASIR*/}
                    <Route
                        path="/listdrivingorder/display"
                        element={
                            <Layout>
                                <Content
                                    style={{
                                        // margin: "24px",
                                        padding: 24,
                                        minHeight: "100vh",
                                        background: "#red",
                                    }}
                                >
                                    <PageDisplayDrivingOrder />
                                </Content>
                            </Layout>
                        }
                    />
                    {/* END PAGE LIST DRIVING ORDER UNTUK DISPLAY KASIR */}

                    {/* PAGE LIST DRIVING ORDER UNTUK DISPLAY TAMU*/}
                    <Route
                        path="/listdrivingorder/public"
                        element={
                            <Layout>
                                <Content
                                    style={{
                                        // margin: "24px",
                                        padding: 24,
                                        minHeight: "100vh",
                                        background: "#red",
                                    }}
                                >
                                    <PageDisplayTamu />
                                </Content>
                            </Layout>
                        }
                    />
                    {/* END PAGE LIST DRIVING ORDER UNTUK DISPLAY TAMU */}

                    {/* PAGE LIST RESTO ORDER */}
                    <Route
                        path="/listrestoorder"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PageListRestoOrder />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE LIST RESTO ORDER */}

                    {/* PAGE REVENUE*/}
                    <Route
                        path="/revenue"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PageClosing />
                                        {/* <PageRevenue /> */}
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE REVENUE */}

                    {/* PAGE PACKAGE DRIVING*/}
                    <Route
                        path="/package-driving"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PagePackageDriving />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PACKAGE DRIVING */}

                    {/* PAGE PACKAGE RESTO*/}
                    <Route
                        path="/package-resto"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PagePackageResto />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PACKAGE RESTO */}

                    {/* PAGE SETTING*/}
                    <Route
                        path="/setting"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PageSetting />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END SETTING */}

                    {/* PAGE USER REGISTRASI*/}
                    <Route
                        path="/user-registrasi"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PageUserRegistrasi />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE USER REGISTRASI */}

                    {/* PAGE USER MENU*/}
                    <Route
                        path="/user-menu"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PageUserMenu />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE USER MENU */}

                    {/* PAGE Report Revenue*/}
                    <Route
                        path="/revenue-report"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PageRevenueReport />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE Report Revenue */}

                    {/* PAGE Print Billing*/}
                    <Route
                        path="/print-bill"
                        element={
                            <PagePrintBilling />
                            // <Layout>
                            //     <AppSide collapsed={collapsed} />
                            //     <Layout className="site-layout">
                            //         <AppHeaders
                            //             setClickTombol={getCollapse}
                            //             openShowDrawer={showDrawer}
                            //         />
                            //         <Content
                            //             style={{
                            //                 margin: "24px 16px",
                            //                 padding: 24,
                            //                 minHeight: "82vh",
                            //                 background: colorBgContainer,
                            //             }}
                            //         >
                            //             <PagePrintBilling />
                            //         </Content>
                            //     </Layout>
                            // </Layout>
                        }
                    />
                    {/* END PAGE Print Billing */}

                    {/* PAGE Resto Reservasi*/}
                    <Route
                        path="/resto-reservasi"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PageRestoranReservasi />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE Resto Reservasi */}

                    {/* PAGE Resto REgistrasi*/}
                    <Route
                        path="/resto-registrasi"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <PageRestoranRegistrasi />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE Resto REgistrasi */}

                    {/* PAGE Payment*/}
                    <Route
                        path="/payment"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <Content style={contentStyle}>
                                        <PagePayment />
                                    </Content>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE Payment */}

                    {/* PAGE Add Hours*/}
                    <Route
                        path="/addhours"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <PageAddHoursAndResto />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE Add Hours */}

                    {/* PAGE VOUCHER REGISTRASI*/}
                    <Route
                        path="/voucher-registrasi"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <PageRegistrasiVoucher />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE VOUCHER REGISTRASI */}

                    {/* KHUSUS NAVIGATOR */}

                    {/* PAGE DAFTAR MENU RESTO*/}
                    <Route
                        path="/daftar-order-resto"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <PageDaftarMenuOrderResto />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE DAFTAR MENU RESTO */}

                    {/* PAGE TAMBAH JAM DRIVING MOBILE*/}
                    <Route
                        path="/tambahjamdriving"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <PageTambahJam />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE TAMBAH JAM DRIVING MOBILE */}

                    {/* PAGE TAMBAH PESANAN RESTO MOBILE*/}
                    <Route
                        path="/tambahpesananresto"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <PageTambahMakanan />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE TAMBAH PESANAN RESTO MOBILE */}

                    {/* PAGE CEK LIST PESANAN WAITER*/}
                    <Route
                        path="/ceklistpesananwaiter"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <PageCekListPesananWaiter />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE CEK LIST PESANAN WAITER */}

                    {/* PAGE LIHAT PESANAN RESTO KU*/}
                    <Route
                        path="/lihatpesananrestoku"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <PageLihatPesananRestoKu />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE LIHAT PESANAN RESTO KU */}

                    {/* PAGE REGISTRASI RESTORAN*/}
                    <Route
                        path="/restoran-registrasi"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <AddFormRestoranRegistrasi />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE REGISTRASI RESTORAN */}

                    {/* PAGE CEK LIST PESANAN RESTORAN WAITER*/}
                    <Route
                        path="/ceklistpesanarestorannwaiter"
                        element={
                            <Layout>
                                <AppSide collapsed={collapsed} />
                                <Layout className="site-layout">
                                    <AppHeaders
                                        setClickTombol={getCollapse}
                                        openShowDrawer={showDrawer}
                                    />
                                    <div
                                        className="md:my-[24px] md:mx-[16px] md:p-[24px] md:bg-[#FFFFFF] 
                                        min-h-[70vh]
                                        bg-[#F5F5F5]
                                        p-[20px] 
                                        overflow-auto"
                                    >
                                        <Content>
                                            <PageCekListPesananRestoranWaiter />
                                        </Content>
                                    </div>
                                </Layout>
                            </Layout>
                        }
                    />
                    {/* END PAGE CEK LIST PESANAN RESTORAN WAITER */}

                    {/* END KHUSUS NAVIGATOR */}
                </Routes>

                {/* End Jika berhasil Login */}
                {/* </Layout> */}

                <Drawer
                    title="G-Swing"
                    placement="left"
                    onClose={onClose}
                    open={open}
                    styles={{
                        header: { backgroundColor: "#04233F" },
                        body: {
                            padding: "0",
                            backgroundColor: "#001529",
                            color: "white",
                        },
                    }}
                    width={250}
                >
                    {/* <div className="logo" /> */}
                    <Menu
                        theme="dark"
                        style={{ height: "89.8vh" }}
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        items={menuAdmin}
                    />
                </Drawer>
            </Layout>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
    );
};
export default App;
