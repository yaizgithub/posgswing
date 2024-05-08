import {
    Badge,
    Button,
    Card,
    Image,
    Radio,
    Skeleton,
    Table,
} from "antd";
import React, { useState } from "react";
import { usePackageRestoData } from "../../../hooks/usePackageRestoData";
import TableRegistrasiResto from "../../../components/registrasirestoorder/TableRegistrasiResto";
import PageAddQty from "./PageAddQty";
import { useKategoriMenuData } from "../../../hooks/useKategoriMenuData";
import { useClassMenuData } from "../../../hooks/useClassMenuData";
import { useNavigate } from "react-router-dom";


const PageAddRestoOrder = (props) => {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState("F");

    ///HOOKs
    //   const { data: dataMeja } = useMejaOrderByStatusData("0", true);
    const { data: dataPackageResto, isLoading, isError, error } = usePackageRestoData(true);
    const { data: dataKategoriMenu } = useKategoriMenuData(true);
    const { data: dataClassMenu } = useClassMenuData(true);

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
            // title: 'Items',
            // dataIndex: 'name',
            key: "1",
            width: "250px",
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return (
                    // String(record.id).toLowerCase().includes(value.toLowerCase()) ||
                    // String(record.name).toLowerCase().includes(value.toLowerCase()) ||
                    // String(record.class_menu).toLowerCase().includes(value.toLowerCase())
                    record.categori_menu === value || record.class_menu === value
                );
            },
            render: (_, record) => {
                return (
                    <div className="flex flex-wrap justify-start items-center gap-3">
                        <div>
                            <Badge
                                count={
                                    record.disc_persen > 0 ? (
                                        <div className="text-right text-[12px] pr-3">
                                            <span className="rounded-full bg-red-700 py-1 px-1 text-white">
                                                {record.disc_persen} %
                                            </span>
                                        </div>
                                    ) : null
                                }
                            >
                                <Image
                                    preview={true}
                                    src={record.image}
                                    width={70}
                                    height={70}
                                    style={{ borderRadius: "10px" }}
                                />
                            </Badge>
                        </div>
                        <div>
                            <div>{record.name}</div>
                            <div>{record.price}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            // title: 'Price',
            // dataIndex: 'id',
            key: "2",
            render: (_, record) => {
                return <PageAddQty itemTerpilih={record} />;
            },
        },
    ];

    const onChangeKategori = (v) => {
        let value = v.target.value;
        // setKategoriMenu(value);
        setSearchText(value);
    };

    const onChangeClassMenu = (v) => {
        let value = v.target.value;
        setSearchText(value);
    };


    const onClickLihatPesanan=()=>{
        navigate("/lihatpesananrestoku");
    }


    return (
        <div>

            <div className="mb-3 flex flex-wrap justify-center items-center gap-7">
                <div>
                    <Radio.Group buttonStyle="outline" onChange={onChangeKategori} >
                        {/* <Radio.Button value={""}>{"All"}</Radio.Button> */}
                        {dataKategoriMenu?.data?.map((e, key) => (
                            <Radio.Button key={key} value={e.id}>
                                {e.name}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
                <div>
                    <Radio.Group buttonStyle="outline" onChange={onChangeClassMenu}>
                        {dataClassMenu?.data?.map((e, key) => (
                            <Radio.Button key={key} value={e.id}>
                                {e.name}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
            </div>

            {/* <div className="mb-3 w-[200px] float-right">
                    <Input.Search
                        placeholder="Search here..."
                        onSearch={(value) => {
                            setSearchText(value);
                        }}

                    />
                </div> */}

            <div className="flex flex-wrap justify-center items-start gap-7">
                <div className="md:overflow-y-scroll h-[590px]">
                    <Table
                        rowKey="id"
                        // scroll={{
                        //     y: 590,
                        // }}
                        pagination={false}
                        // dataSource={isClassMenuClick ? dataPackageRestoOrderByKategoriAndClass?.data : dataPackageRestoOrderByKategori?.data}
                        dataSource={dataPackageResto?.data}
                        columns={columns}
                        style={{ width: "390px" }}
                    />

                    <div className="md:hidden">
                        <Button block style={{height:"55px", backgroundColor:"#F89421", color:"#ffffff", fontWeight:"bold"}} onClick={onClickLihatPesanan}>Lihat Pesanan</Button>
                    </div>

                </div>


                <div className="md:block hidden">
                    <Card title="Order List" size="small">
                        <TableRegistrasiResto />
                    </Card>
                </div>
            </div>

        </div>
    );
};

export default PageAddRestoOrder;
