import { Table, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../config";
import { useWaktuServerData } from "../../hooks/useWaktuServer";

const { Title, Text } = Typography;

const ViewRevenuePayment = () => {

    const [dataRevenue, setDataRevenue] = useState([]);

    ///HOOks
    const {data: currDate} = useWaktuServerData();

    useEffect(() => {
        ambilData();
    }, [])


    const ambilData=async()=>{
        if (currDate) {
            await axios.get(`${baseUrl}/revenue/rpt-revenue-payment?date=${currDate.waktuserver}`)
            .then((res)=>{
                // console.log(res.data.data);
                setDataRevenue(res.data.data);
            }).catch((err)=>console.log(err));
        }
    }
    


	const columns = [
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Today",
			dataIndex: "today",
			key: "today",
            align: 'right',
            render: (value) => {
                return value.toLocaleString("id");
            },
		},
		{
			title: "thisMonth",
			dataIndex: "thisMonth",
			key: "thisMonth",
            align: 'right',
            render: (value) => {
                return value.toLocaleString("id");
            },
		},
		{
			title: "monthBudget",
			dataIndex: "monthBudget",
			key: "monthBudget",
            align: 'right',
            render: (value) => {
                return value.toLocaleString("id");
            },
		},
		{
			title: "monthVariance",
			dataIndex: "monthVariance",
			key: "monthVariance",
            align: 'right',
            render: (value) => {
                return value.toLocaleString("id");
            },
		},
		{
			title: "thisYear",
			dataIndex: "thisYear",
			key: "thisYear",
            align: 'right',
            render: (value) => {
                return value.toLocaleString("id");
            },
		},
		{
			title: "yearBudget",
			dataIndex: "yearBudget",
			key: "yearBudget",
            align: 'right',
            render: (value) => {
                return value.toLocaleString("id");
            },
		},
		{
			title: "yearVariance",
			dataIndex: "yearVariance",
			key: "yearVariance",
            align: 'right',
            render: (value) => {
                return value.toLocaleString("id");
            },
		},
	];

    const summary = (data) => {
        let totalToday = 0;
        let totalMonth = 0;
        let totalMonthBudget = 0;
        let totalMonthVariance = 0;
        let totalYear = 0;
        let totalYearBudget = 0;
        let totalYearVariance = 0;
        data.forEach((e) => {
            totalToday += e.today;          
            totalMonth += e.thisMonth;          
            totalMonthBudget += e.monthBudget;          
            totalMonthVariance += e.monthVariance;          
            totalYear += e.thisYear;     
            totalYearBudget += e.yearBudget;          
            totalYearVariance += e.yearVariance;       
        });
        return (
          <>
            <Table.Summary.Row>
            <Table.Summary.Cell index={0}>
                <div className="font-semibold">Total</div>
            </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <div className="text-right font-semibold">{totalToday.toLocaleString("id")}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div className="text-right font-semibold">{totalMonth.toLocaleString("id")}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <div className="text-right font-semibold">{totalMonthBudget.toLocaleString("id")}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <div className="text-right font-semibold">{totalMonthVariance.toLocaleString("id")}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                <div className="text-right font-semibold">{totalYear.toLocaleString("id")}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                <div className="text-right font-semibold">{totalYearBudget.toLocaleString("id")}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7}>
                <div className="text-right font-semibold">{totalYearVariance.toLocaleString("id")}</div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      };

	return (
		<div>
			<div>
				<Table pagination={false} showHeader={false} rowKey={"description"} dataSource={dataRevenue} columns={columns} summary={summary}/>
			</div>
		</div>
	);
};

export default ViewRevenuePayment;
