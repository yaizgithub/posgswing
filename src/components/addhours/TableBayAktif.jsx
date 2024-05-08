import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Divider, Dropdown, Input, Modal, Skeleton, Table } from "antd";

import { useDispatch } from "react-redux";
import { reduxUpdateMatrixSelected } from "../../features/mymatrixselectedSlice";
import { reduxUpdateNumberIdentifikasi } from "../../features/mydataselectedSlice";
import { baseUrl } from "../../config";
import axios from "axios";
import { FaEllipsisVertical, FaCartShopping } from "react-icons/fa6";

import TableRegistrasiResto from "../../components/registrasirestoorder/TableRegistrasiResto";
import { useGetNomorBayAktif, useTotalJamRegistrasiDrivinRegisIdData } from "../../hooks/registrasi/useRegistrasiDrivingData";
import PageAddDrivingOrder from "../../containers/pages/matrix/PageAddDrivingOrder";
import PageAddRestoOrder from "../../containers/pages/matrix/PageAddRestoOrder";
import { useNavigate } from "react-router-dom";

const items =[
    {
        label:<div className="py-2">Driving</div>,
        key:"driving",
    },
    {
        label:<div className="py-2">F&B</div>,
        key:"resto",
    },
    {
        type: 'divider',    
    },
    {
        label:<div className="py-2">Check Orders</div>,
        key:"ceklistpesanan",
    },
]

const TableBayAktif = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [isShowModalOrderDriving, setIsShowModalOrderDriving] = useState(false);
    const [isShowModalOrderResto, setIsShowModalOrderResto] = useState(false);
    const [isShowModalKeranjang, setIsShowModalKeranjang] = useState(false);
    
    const [customer, setCustomer] = useState();
    const [registrasiID, setRegistrasiID] = useState();

    const dispatch = useDispatch();

    useEffect(() => { }, [registrasiID]);

    ///HOOKs
    const { refetch: refetchTotalJamDrivingOrder } =
        useTotalJamRegistrasiDrivinRegisIdData(registrasiID, false);
    const { data, isLoading, isError, error } = useGetNomorBayAktif(true);

    if (isLoading) {
        return (
            <div>
                <Skeleton active />
            </div>
        );
    }

    if (isError) {
        console.log(error.message);
        return (
            <div>
                <div className="text-red-600 mb-2">{error.message}</div>
                <Skeleton active />
            </div>
        );
    }

    const columns = [
        {
            // title: "Bay",
            dataIndex: "bay",
            key: "bay",
            render: (_, record) => {
                return <div className="text-[16px]">Bay {record.bay}</div>;
            },
            filteredValue: [searchText],
            onFilter: (value, record) => {
                let status = record.status;
                if (status === "0") {
                    status = "open";
                } else if (status === "1") {
                    status = "release";
                }
                return (
                    String(record.bay).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.nama).toLowerCase().includes(value.toLowerCase())
                );
            },
        },
        {
            // title: "Customer",
            dataIndex: "nama",
            key: "nama",
            // align: "right",
            render: (_, record) => {
                return <div>
                    <div className="text-[14px] font-semibold">{record.nama}</div>
                    <div className="text-[10px] text-slate-400">{record.registrasi_id}</div>
                </div>
            },
        },
        {
            // title: "Customer",
            dataIndex: "registrasi_id",
            key: "registrasi_id",
            align: "right",
            render: (_, record) => {
                return (
                    <div>
                        <Dropdown
                            menu={{
                                items,
                                onClick: onClickItems
                            }}
                            trigger={['click']}
                            placement="bottomRight"                            
                        >
                            <Button
                                type="text"
                                shape="circle"
                                icon={<FaEllipsisVertical />}
                                
                            />
                        </Dropdown>

                    </div>
                );
            },
        },
    ];

    const onClickItems=(e)=>{
        // console.log(e.key);
        if (e.key === "driving") {
            navigate("/tambahjamdriving");            
        } else if (e.key === "resto") {
            navigate("/tambahpesananresto");
        } else {
            navigate("/ceklistpesananwaiter");
        }
    }


    const onClickKeranjang=()=>{
        setIsShowModalKeranjang(true);
    }


    return (
        <div>
            <div className="mb-3 md:w-[200px] md:float-right w-full">
                <Input.Search
                    size="large"
                    placeholder="Search here..."
                    onSearch={(value) => {
                        setSearchText(value);
                    }}
                />
            </div>

            <Table
                pagination={false}
                size="large"
                dataSource={data?.data}
                columns={columns}
                rowKey="bay"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: async (event) => {
                            // setIsShowModalOrderDriving(true);
                            setCustomer(record.nama);
                            setRegistrasiID(record.registrasi_id);
                            console.log({
                                namaCustomer: record.nama,
                                bay_id: record.bay,
                                namaBay: `bay` + record.bay,
                                status: "play",
                                registrasi_id: record.registrasi_id,
                            });
                            ///get matrixID
                            let namaBay = `bay` + record.bay;
                            let regisId = record.registrasi_id;
                            await axios
                                .get(
                                    baseUrl +
                                    `/matrix/maxid?namaBay=${namaBay}&registrasi_id=${regisId}`
                                )
                                .then((res) => {
                                    // console.log(res.data.max_id);
                                    let maxId = res.data.max_id;
                                    ///kirim ke redux
                                    dispatch(
                                        reduxUpdateMatrixSelected({
                                            matrixSelected: {
                                                id: maxId,
                                                namaCustomer: record.nama,
                                                bay_id: record.bay,
                                                namaBay: `bay` + record.bay,
                                                status: "play",
                                                registrasi_id: record.registrasi_id,
                                            },
                                        })
                                    );
                                    dispatch(
                                        reduxUpdateNumberIdentifikasi({
                                            numberIdentifikasi: record.registrasi_id,
                                        })
                                    );
                                    ///cek total jam
                                    refetchTotalJamDrivingOrder();
                                })
                                .catch((err) => console.log(err));
                        },
                        onDoubleClick: (event) => {
                            // showConfirm(record.id);
                        },
                    };
                }}
                rowClassName={"custom-table-row"}
            />

            {/* MODAL SHOW ORDER DRIVING */}
            <Modal
                width="630px"
                open={isShowModalOrderDriving}
                onCancel={() => setIsShowModalOrderDriving(false)}
                okText="Proses"
                footer={false}
                closeIcon={false}
                title={`PACKAGE ORDER - ${customer}`}
                styles={{
                    header: { backgroundColor: "#92C7CF", margin: "0px", padding: "5px" },
                }}
            // onOk={onClickProses}
            >
                <div className="mt-5">
                    <PageAddDrivingOrder
                        closeModal={() => setIsShowModalOrderDriving(false)}
                    />
                </div>
            </Modal>
            {/* END MODAL SHOW ORDER DRIVING */}


             {/* MODAL SHOW ORDER RESTO */}
            <Modal
                width="900px"
                open={isShowModalOrderResto}
                onCancel={() => setIsShowModalOrderResto(false)}
                okText="Proses"
                footer={false}
                style={{ top: "30px" }}
                closable={false}
            // onOk={onClickProses}
            >
                <Card
                    title={`F & B ORDER - Table ${customer}`}
                    size="small"
                    styles={{
                        body: { backgroundColor: "#F8F8F8" },
                        header: { backgroundColor: "#92C7CF" },
                    }}
                    extra={
                        <div className="block md:hidden">
                        <Badge count={1} size="small" offset={[-10, 10]}>
                            <Button type="text" shape="circle" onClick={onClickKeranjang}>
                                <FaCartShopping fontSize={"24px"} />
                            </Button>
                        </Badge>
                        </div>
                    }
                >
                    <div className="mt-1">
                        <PageAddRestoOrder
                            closeModal={() => setIsShowModalOrderResto(false)}
                        />
                    </div>
                </Card>
            </Modal>
            {/* END MODAL SHOW ORDER RESTO */}


                        {/* MODAL KERANJANG */}
                        <Modal
            //  width="900px"
             open={isShowModalKeranjang}
             onCancel={() => setIsShowModalKeranjang(false)}
             okText="Proses"
             footer={false}
             style={{ top: "30px" }}
             closable={false}
            >
                <TableRegistrasiResto />
            </Modal>
            {/* END MODAL KERANJANG */}
        </div>
    );
};

export default TableBayAktif;
