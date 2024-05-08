import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Drawer,
    Input,
    Popconfirm,
    Skeleton,
    Space,
    Table,
    Tag,
} from "antd";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { useDispatch } from "react-redux";
import {
    reduxUpdateNumberIdentifikasi,
    reduxUpdateSelected,
} from "../../features/mydataselectedSlice";
import {
    useAllRegistrasiData,
    useDeleteRegistrasiData,    
} from "../../hooks/registrasi/useRegistrasiData";
import BillingDescriptiom from "../billing/BillingDescriptiom";
import { getBillingDrivingOrder } from "../../features/billing/billingdrivingorderSlice";
import { getBillingRestoOrder } from "../../features/billing/billingrestoorderSlice";
import { reduxUpdateMatrixSelected } from "../../features/mymatrixselectedSlice";

const TableAllRegistrasi = (props) => {
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        console.log(searchText);
        setSearchText(props.namaPlayer)
      
    }, [props.namaPlayer])
    


    ///HOOKs
    const { data, isLoading, isError, error } = useAllRegistrasiData(true);
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

    const onChangeSearch=(v)=>{
        if (v.target.value.length > 2) {
            setSearchText(v.target.value)
        }
    }

    const columns = [             
        {
            title: "Customer",
            dataIndex: "nama",
            key: "nama",
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return (                   
                    String(record.nama).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.no_hp).toLowerCase().includes(value.toLowerCase())
                );
            },
            
        },
        {
            title: "Handphone",
            dataIndex: "no_hp",
            key: "no_hp",
        },
       
    ];

    return (
        <div>
            <Card
                title="List Player"
                size="small"
                extra={
                    <div className="w-[200px] float-right">
                        <Input.Search                        
                            placeholder="Search here..."      
                            onSearch={(value) => {                               
                                    setSearchText(value);                                                                    
                            }}
                            onChange={onChangeSearch}                      
                        />
                    </div>
                }
                styles={{header:{backgroundColor:"#F8F6F4"}}}
            >
                <Table
                    size="small"
                    dataSource={data?.data}
                    columns={columns}
                    rowKey="id"
                    onRow={(record, rowIndex) => {
                        return {
                            // onClick: (event) => {
                            //     props.recordSelectedID(record.id);

                            // }, // click row
                            onDoubleClick: (event) => {
                                props.AmbilNamaDanNoHP(record.nama, record.no_hp);
                                props.closeModal();
                            },
                        };
                    }}
                    rowClassName={"custom-table-row"}
                />
            </Card>

           
        </div>
    );
};

export default TableAllRegistrasi;
