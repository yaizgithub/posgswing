import { Table, Typography } from 'antd';
import React from 'react'
import { useRevenuePaymentData } from '../../hooks/revenueData';


const { Text } = Typography;

const TableRevenuePayment = (props) => {

    ///HOOKs    
    const { data } = useRevenuePaymentData([props.dari, props.sampai], true);

    const columns = [

        {
            title: "Description",
            dataIndex: "group_payment",
            key: "group_payment",
            width: "120px",
        },
        {
            title: "Total",
            dataIndex: "hasil",
            key: "hasil",
            // width:"10px",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },

    ];

    return (
        <div>
            <Table
                size="small"
                style={{ width: "300px" }}
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            props.ambilRecord(record);
                            // console.log(record);
                        }, // click row
                        onDoubleClick: (event) => {

                        },

                    };
                }}

                summary={pageData => {
                    let grandTotal = 0;

                    pageData.forEach(({ hasil }) => {
                        grandTotal += hasil;
                    });

                    return (
                        <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell>Total</Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <div className='text-right font-bold'>
                                        <Text>{grandTotal.toLocaleString("id")}</Text>
                                    </div>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            />
        </div>
    )
}

export default TableRevenuePayment