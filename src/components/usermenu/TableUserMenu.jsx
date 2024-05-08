import { Button, Popconfirm, Skeleton, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { DeleteOutlined } from "@ant-design/icons";
import { useDeleteUserMenuData, useOneUserMenu } from '../../hooks/useUserMenuData';
import { useSelector } from 'react-redux';

const TableUserMenu = () => {


    const {dataSelected} = useSelector((state)=>state.mydataselected);

    useEffect(() => {

    }, [dataSelected])
    

    ///HOOKs
    const {mutateAsync: mutateDeleteUserMenuData} = useDeleteUserMenuData();
    const {data, isLoading, isError, error} = useOneUserMenu(dataSelected.id,true);
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
        title: "Action",
        key: "action",
        render: (_, record) => {
            // console.log(record);
            // setDataTerpilih(record);
            // dispatch(reduxUpdateSelected({ dataSelected: record }));
            return (
                <>
                    <Space>
                        <Popconfirm
                            title="Delete Registrasi Data"
                            description={`Are you sure to delete ${record.id} ?`}
                            onConfirm={() => mutateDeleteUserMenuData(record.id)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                shape="circle"
                                type="text"
                                size="small"
                            />
                        </Popconfirm>                            
                    </Space>
                </>
            );
        },
    },

    {
        title: "Menu",
        dataIndex: "label",
        key: "label",
    },
 
];

  return (
    <div>
        
      <Table
      pagination={false}
                size="small"
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record);
                        }, // click row
                        onDoubleClick: (event) => {
                            // setisShowEditModal(true);
                            // dispatch(reduxUpdateSelected({ dataSelected: record }));
                            // dispatch(
                            //     reduxUpdateNumberIdentifikasi({ numberIdentifikasi: record.id })
                            // );
                            // dispatch(reduxUpdateNomorBay({ nomorBay: record.bay }));
                        },
                    };
                }}
                rowClassName={"custom-table-row"}
            />
    </div>
  )
}

export default TableUserMenu