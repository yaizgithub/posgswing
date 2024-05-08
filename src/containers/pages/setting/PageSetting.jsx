import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, List, Modal, Space, message } from "antd";
import { Link } from "react-router-dom";
import { UserAddOutlined, MenuOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import axios from "axios";
import { baseUrl } from "../../../config";
import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import dayjs from "dayjs";

const data = [
    {
        title: "User Registrasi",
        description: "Daftarkan user yang akan melakukan login",
        path: "/user-registrasi",
        icon: <UserAddOutlined />,
    },

    // {
    //     title: "User Menu",
    //     description: "Sesuaikan menu yang akan diakses",
    //     path: "/user-menu",
    //     icon: <MenuOutlined />,
    // },
];

const PageSetting = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch();

    const [isShowModalOpenCashier, setisShowModalOpenCashier] = useState(false);

    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "Setting",
            })
        );
    }, [dispatch]);

    ///HOOKs
    const { data: dataWaktuServer } = useWaktuServerData(true);

    const successMessage = () => {
        messageApi.open({
          type: 'success',
          content: 'Saving data success',    
        });
      };    

      const errorMessage = () => {
        messageApi.open({
          type: 'error',
          content: 'Matrix sudah ada',    
        });
      };         

    const createMatrix = async (id, date, time) => {
        let data = {
            id: id,
            date: dayjs(date).format("YYYY-MM-DD"),
            time: time,
        };
        await axios
            .post(baseUrl + `/matrix`, data)
            .then((res) => {
                console.log(res.data.message);
            })
            .catch((err) => console.log(err));
    };

    const buatkanMatrixBay =async()=>{
        let tgl = dayjs(dataWaktuServer?.waktuserver).format("YYYY-MM-DD");
        await axios
            .get(baseUrl + `/matrix/orderbydate?date=${tgl}}`)
            .then((res) => {
                if (res.data.success) {
                    // console.log("matrix sudah ada");
                    errorMessage();
                } else {
                    ///buat matrix
                    let idBay = dayjs(tgl).format("DDMMYY");

                    for (let i = 6; i <= 23; i++) {
                        // console.log(i);
                        if (i.toString().length < 2) {
                            let time = `0${i}:00:00`;
                            // createMatrix(i, tgl, time);
                            createMatrix(idBay+`0${i}`, tgl, time);
                        } else {
                            let time = `${i}:00:00`;
                            // createMatrix(i, tgl, time);
                            createMatrix(idBay+i, tgl, time);
                        }
                    }
                    successMessage();                    
                }
            })
            .catch((err) => console.log(err));        
    }

    const onClickOpenCashier = async () => {
        setisShowModalOpenCashier(true);
    };

    const onClickClearDisplayAndTable = async () => {
        await axios
            .put(baseUrl + `/bay/edit-clear`)
            .then((res) => {
                console.log(res.data.message);
            })
            .catch((err) => console.log(err));

            await axios
            .put(baseUrl + `/meja/edit-clear`)
            .then((res) => {
                console.log(res.data.message);
            })
            .catch((err) => console.log(err));    
    };

    return (
        <div>
            {contextHolder}
            <List
                // bordered="true"
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar style={{ backgroundColor: "#062E6F" }}>
                                    {item.icon}
                                </Avatar>
                            }
                            title={<Link to={item.path}>{item.title}</Link>}
                            description={item.description}
                        />
                    </List.Item>
                )}
            />

            <div>
                <Space>
                    <Button onClick={onClickOpenCashier}>Open Cashier</Button>
                    <Button onClick={onClickClearDisplayAndTable}>Clear Display Bay & Table</Button>
                </Space>
            </div>


            {/* Modal Open Cashier */}
            <Modal onCancel={()=>setisShowModalOpenCashier(false)} open={isShowModalOpenCashier}>
                            <Card title="Open Cashier" size="small">
                                    <Button onClick={buatkanMatrixBay}>Create Matrix</Button>
                            </Card>
            </Modal>
            {/* END Modal Open Cashier */}
        </div>
    );
};

export default PageSetting;
