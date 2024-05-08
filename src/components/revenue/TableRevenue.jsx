import { Table, Typography } from 'antd';
import React from 'react'
import { useRevenueData } from '../../hooks/revenueData';


const { Text } = Typography;

const TableRevenue = (props) => {

        ///HOOKs    
        const {data} = useRevenueData([props.dari, props.sampai],true);

    const columns = [
 
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "120px",
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            // width:"10px",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Total Hours",
            dataIndex: "totJam",
            key: "totJam",
            // width:"10px",
            align: "right",           
        },
        {
            title: "Total Seconds",
            dataIndex: "totDetik",
            key: "totDetik",
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
                rowKey="description"
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
            
                    pageData.forEach(({ total }) => {
                      grandTotal += total;                      
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

export default TableRevenue