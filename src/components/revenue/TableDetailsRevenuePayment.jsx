import { Table, Typography } from 'antd';
import React from 'react'
import { useDetailsRevenuePaymentData, useRevenuePaymentData } from '../../hooks/revenueData';


const { Text } = Typography;

const TableDetailsRevenuePayment = (props) => {

    ///HOOKs    
    const { data } = useDetailsRevenuePaymentData([props.dari, props.sampai, props.groupPayment], true);

    const columns = [

        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "120px",
        },
        {
            title: "Total",
            dataIndex: "totHasil",
            key: "totHasil",
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
                            // console.log(record);
                        }, // click row
                        onDoubleClick: (event) => {

                        },

                    };
                }}

                summary={pageData => {
                    let grandTotal = 0;

                    pageData.forEach(({ totHasil }) => {
                        grandTotal += totHasil;
                    });

                    return (
                        <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell>Total</Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <div className='text-right font-bold'>
                                        <Text >{grandTotal.toLocaleString("id")}</Text>
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

export default TableDetailsRevenuePayment