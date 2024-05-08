import { Button, Dropdown, Skeleton, Table } from "antd";
import React, { useState } from "react";
import { useMejaRestoran } from "../../hooks/useMejaData";
import mejaColor from "../../image/mejaColor.png";
import mejaBW from "../../image/mejaBW.png";
import { FaEllipsisVertical, FaCartShopping } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config";
import { useDispatch } from "react-redux";
import { reduxUpdateMatrixSelected } from "../../features/mymatrixselectedSlice";
import { reduxUpdateNumberIdentifikasi } from "../../features/mydataselectedSlice";

const items = [
    {
        label: <div className="py-2">Registrasi</div>,
        key: "registrasi",
    },
    {
        label: <div className="py-2">Add F&B</div>,
        key: "order",
    },
    {
        type: "divider",
    },
    {
        label: <div className="py-2">Check Orders</div>,
        key: "ceklistpesanan",
    },
];

const TableMejaRestoran = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState("");
    const [nomorMeja, setNomorMeja] = useState("");

    ///HOOKs
    const { data, isLoading, isError, error } = useMejaRestoran(true);

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
            // title: "Table",
            dataIndex: "id",
            key: "id",
            // align:"left",
            filteredValue: [searchText],
            onFilter: (value, record) => {
                let status = record.status;
                if (status === "0") {
                    status = "open";
                } else if (status === "1") {
                    status = "release";
                }
                return (
                    String(record.id).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.name).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.status).toLowerCase().includes(value.toLowerCase())
                );
            },
            render: (_, record) => {
                return (
                    <div className="pl-3">
                        <div className="text-[12px]">Table</div>
                        <div>
                            {record.status === "0" ? (
                                <div className="text-3xl font-semibold p-0 text-green-700">
                                    {record.id}
                                </div>
                            ) : (
                                <div className="text-3xl font-semibold p-0 text-red-700">
                                    {record.id}
                                </div>
                            )}
                        </div>
                        <div>
                            {record.status === "1" ? (
                                <div className="text-red-700">In-Used</div>
                            ) : (
                                <div className="text-green-700">Available</div>
                            )}
                        </div>
                    </div>
                );
            },
        },
        // {
        //     title: "name",
        //     // dataIndex: "name",
        //     // key: "name",
        //     render:(_, record)=>{
        //         return <div>
        //         {record.status === "0" ? (
        //             <div className="w-[100px] md:w-[120px]">
        //                 <img alt="example" src={mejaBW} />
        //             </div>
        //         ) : (
        //             <div className="w-[100px] md:w-[120px]">
        //                 <img alt="example" src={mejaColor} />
        //             </div>
        //         )}
        //     </div>
        //     }
        // },
        // {
        //     title: "status",
        //     dataIndex: "status",
        //     key: "status",
        //     render: (_, record) => {
        //         return (
        //             <div>
        //                 {record.status === "1" ? (
        //                     <div className="text-red-700">In-Used</div>
        //                 ) : (
        //                     <div className="text-green-700">Available</div>
        //                 )}
        //             </div>
        //         );
        //     },
        // },
        {
            align:"right",
            render: (_, record) => {
                return (
                    <div>
                        <Dropdown
                            menu={{
                                items,
                                onClick: onClickItems,
                            }}
                            trigger={["click"]}
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

    const tambahMenu = async() => {
        ///cari no.registrasinya
        // console.log(v.target.value);
        console.log("----nomo meja---");
        console.log(nomorMeja);
        console.log("----nomo meja---");
    
        await axios.get(baseUrl+`/registrasi/orderbymeja?no_meja=${nomorMeja}`)
        .then((res)=>{
            // console.log(res.data.data[0].id);
            let regisId=res.data.data[0].id;
            
            ///kirim ke redux
            dispatch(
                reduxUpdateMatrixSelected({
                    matrixSelected: {                                
                        registrasi_id: regisId,
                    },
                })
            );
            dispatch(
                reduxUpdateNumberIdentifikasi({ numberIdentifikasi: regisId })
            );

            ///tampilkan modal
            // setIsShowModalOrderResto(true);
            navigate("/tambahpesananresto");
        }).catch((err)=>console.log(err));        
};

    const onClickItems = (e) => {
        // console.log(e.key);
        if (e.key === "registrasi") {
            navigate("/restoran-registrasi", { state: { nomorMeja: nomorMeja } });
        } else if (e.key === "order") {
            tambahMenu();
        } else {
            navigate("/ceklistpesanarestorannwaiter", { state: { nomorMeja: nomorMeja } });
        }
    };

    return (
        <div>
            <Table
                pagination={false}
                size="middle"
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            setNomorMeja(record.id)
                        },
                        onDoubleClick: (event) => {
                            // showConfirm(record.id);
                        },
                    };
                }}
                rowClassName={"custom-table-row"}
            />
        </div>
    );
};

export default TableMejaRestoran;
