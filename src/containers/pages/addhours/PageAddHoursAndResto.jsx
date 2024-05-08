import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import beepSound from "../../../assets/beep_alarm.mp3";
import TableBayAktif from "../../../components/addhours/TableBayAktif";
import { useGetListRestoOrderStatusReadyData } from "../../../hooks/useListRestoOrderData";
import { notification } from "antd";

const PageAddHoursAndResto = () => {
  // const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();

  // // ///HOOKs
  // const { data, isLoading, isError, error } = useGetListRestoOrderStatusReadyData(
  //     true
  // );

  useEffect(() => {
    dispatch(
      reduxUpdateTitle({
        rTitle: "Add Hours / F&B",
      })
    );
  }, [dispatch]);

  // useEffect(() => {
  //     // console.log(data);
  //     if (data?.data !== undefined) {
  //             data?.data.forEach((e) => {
  //                 console.log(e.status_order);
  //                 if (e.status_order === "2" && e.bay !== null) {
  //                     openNotificationBay('topRight', e.bay)
  //                     playSound();
  //                 } else {
  //                     openNotificationMeja('topRight', e.noMejaRestoran)
  //                     playSound();
  //                 }
  //             });
  //     }
  // }, [data]);

  // const openNotificationBay = (placement, bay) => {
  //     api.info({
  //       message: `Bay ${bay}, The Order is ready`,
  //       description: `Pesanan sudah siap`,
  //       placement,
  //     });
  //   };

  //   const openNotificationMeja = (placement, nomeja) => {
  //     api.info({
  //       message: `Table ${nomeja}, The Order is ready`,
  //       description: `Pesanan sudah siap`,
  //       placement,
  //     });
  //   };

  return (
    <div>
      {/* {contextHolder} */}
      <TableBayAktif />
    </div>
  );
};

export default PageAddHoursAndResto;
