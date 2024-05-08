import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import TableMejaRestoran from "../../../components/restoran/TableMejaRestoran";
import { notification } from "antd";
import { useGetListRestoOrderStatusReadyData } from "../../../hooks/useListRestoOrderData";
import beepSound from "../../../assets/beep_alarm.mp3";

const PageRestoranRegistrasi = () => {
    const [api, contextHolder] = notification.useNotification();
    const dispatch = useDispatch();

    ///HOOKs
    const { data, isLoading, isError, error } =
        useGetListRestoOrderStatusReadyData(true);

    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "F&B Registrasi",
            })
        );
    }, [dispatch]);

    useEffect(() => {
        // console.log(data);
        if (data?.data !== undefined) {
            data?.data.forEach((e) => {
                console.log(e.status_order);
                if (e.status_order === "2" && e.bay !== null) {
                    openNotificationBay('topRight', e.bay)
                    playSound();
                } else {
                    openNotificationMeja('topRight', e.noMejaRestoran)
                    playSound();
                }
            });   
        }
    }, [data]);

    const playSound = () => {
        new Audio(beepSound).play();
    };

    const openNotificationBay = (placement, bay) => {
        api.info({
          message: `Bay ${bay}, The Order is ready`,
          description: `Pesanan sudah siap`,
          placement,
        });
      };

      const openNotificationMeja = (placement, nomeja) => {
        api.info({
          message: `Table ${nomeja}, The Order is ready`,
          description: `Pesanan sudah siap`,
          placement,
        });
      };

    return (
        <div>
            {contextHolder}
            <TableMejaRestoran />
        </div>
    );
};

export default PageRestoranRegistrasi;
