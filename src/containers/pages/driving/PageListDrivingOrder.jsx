import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import { Button, Card, DatePicker, TimePicker } from "antd";
import TableListDrivingOrder from "../../../components/driving/TableListDrivingOrder";
import TableList2DrivingOrder from "../../../components/driving/TableList2DrivingOrder";
import dayjs from "dayjs";
import { useUpdateStatusBayData, useUpdateTimeCurrentBayData } from "../../../hooks/useBayData";


const PageListDrivingOrder = () => {
    const dispatch = useDispatch();
    
    const { nomorBay } = useSelector(
        (state) => state.mydataselected
    );

    const [current, setCurrent] = useState();
    const [start, setStart] = useState(dayjs().format("HH:mm:ss"));
    const [end, setEnd] = useState(dayjs().add(5, "second").format("HH:mm:ss"));

    ///HOOKs
    const {mutate: mutateUpdateTimeCurrentBay} = useUpdateTimeCurrentBayData();
    const {mutate: mutateUpdateStatusBay} = useUpdateStatusBayData();

    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "List Order Driving",
            })
        );
    }, [dispatch]);


    // useEffect(() => {
    //     const a = setInterval(() => {
            
    //         ///update durasi bay
    //          mutateUpdateTimeCurrentBay();     

    //         ///update status kembali ke 0 jika durasinya sudah selesai
    //          mutateUpdateStatusBay();       
    //     }, 1000);
    //     return()=>{
    //         clearInterval(a);
    //     }
    // })
    

    return (
        <div>                        

            <Card size="small">
                <div className="mb-10 flex flex-wrap justify-between gap-5">
                    <div className="flex-1">
                        <Card title="Display" size="small" styles={{header:{backgroundColor:"#86A789"}}}>
                        <TableListDrivingOrder />
                        </Card>
                    </div>
                    <div className="flex-1">
                        <Card title="Display" size="small" styles={{header:{backgroundColor:"#86A789"}}}>
                        <TableList2DrivingOrder />
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PageListDrivingOrder;
