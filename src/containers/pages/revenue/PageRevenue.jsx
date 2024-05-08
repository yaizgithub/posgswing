import { Button, Card, DatePicker, Form, Space } from "antd";
import React, { useEffect, useState } from "react";
import {
    useRevenueData,
    useRevenuePaymentData,
} from "../../../hooks/revenueData";
import dayjs from "dayjs";
import TableRevenue from "../../../components/revenue/TableRevenue";
import TableRevenuePayment from "../../../components/revenue/TableRevenuePayment";
import TableDetailsRevenuePayment from "../../../components/revenue/TableDetailsRevenuePayment";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import PageRevenueReport from "./PageRevenueReport";

const formatDate = "DD/MM/YYYY";

const PageRevenue = () => {
    const [form] = Form.useForm();
    const navigate= useNavigate();

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [tanggal, setTanggal] = useState({ dari: dayjs(), sampai: dayjs() });
    const [recordSelected, setRecordSelected] = useState("");


    useEffect(() => {
      dispatch(
          reduxUpdateTitle({
              rTitle: "Revenue",
          })
      );
  }, [dispatch]);

    ///HOOKs
    const { data: dataRevenue, refetchRevenue } = useRevenueData(
        [tanggal.dari, tanggal.sampai],
        false
    );
    const { data: dataRevenuePayment, refetchRevenuePayment } =
        useRevenuePaymentData([tanggal.dari, tanggal.sampai], false);

    const onFinish = async (v) => {
        setTanggal({
            dari: dayjs(v.date1).format("YYYY-MM-DD"),
            sampai: dayjs(v.date2).format("YYYY-MM-DD"),
        });
    };

    const getRecordSelected = (a) => {
        console.log(a);
        setRecordSelected(a);
    };

    const onClickPrint=()=>{
        navigate("/revenue-report", {state:{ date:dayjs(tanggal.dari).format("YYYY-MM-DD")}});
    }

    return (
        <div>
            <div className="mb-5">
            <Form
                layout="inline"
                // labelCol={{
                //     // offset: 1,
                //     span: 6,
                // }}
                // wrapperCol={{
                //     // offset: 1,
                //     span: 14,
                // }}
                form={form}
                name="form-revenue"
                onFinish={onFinish}
                initialValues={{ date1: dayjs(), date2: dayjs() }}
            // onClick={onChangeLocation}
            // onFieldsChange={onChangeLocation}
            // style={{
            //     maxWidth: 600,
            // }}
            >
                <Form.Item name="date1" label=" Date">
                    <DatePicker format={formatDate} />
                </Form.Item>

                {/* <Form.Item name="date2" label="End">
                    <DatePicker format={formatDate} />
                </Form.Item> */}

                <Form.Item wrapperCol={{ offset: 1, span: 20 }}>
                    {/* <div className="float-right"> */}
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            style={{ width: 70 }}
                        >
                            Proses
                        </Button>
                        <Button onClick={onClickPrint}>
                            Print Preview
                        </Button>
                        </Space>
                    {/* </div> */}
                </Form.Item>
            </Form>
            </div>

            {/* <PageRevenueReport date={dayjs(tanggal.dari).format("YYYY-MM-DD")}/> */}

            <div className="flex flex-wrap justify-evenly items-start">
                <div >
                    <Card title="Transaction" size="small">
                        <TableRevenue dari={tanggal.dari} sampai={tanggal.sampai} />
                    </Card>
                </div>
                <div>
                    <Card title="Revenue" size="small">
                        <TableRevenuePayment
                            dari={tanggal.dari}
                            sampai={tanggal.sampai}
                            ambilRecord={getRecordSelected}
                        />
                    </Card>
                </div>
                <div>
                    <Card title="Details Payment" size="small">
                        <TableDetailsRevenuePayment
                            dari={tanggal.dari}
                            sampai={tanggal.sampai}
                            groupPayment={recordSelected?.group_payment}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PageRevenue;
