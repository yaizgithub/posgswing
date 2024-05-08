import React, { useEffect, useState } from "react";
import {
    ColumnDirective,
    ColumnsDirective,
    CommandColumn,
    GridComponent,
    Inject,
    Search,
    Toolbar,
    Page,
    ContextMenu,
} from "@syncfusion/ej2-react-grids";
import {
    useMatrixbayDataOrderByDate,
    useUpdateClearCellMatrixbayData,
    useUpdateStatusCheckinToPlayMatrixBay,
} from "../../../hooks/useMatrixbayData";
import {
    Button,
    Card,
    Drawer,
    Modal,
    Skeleton,
    message,
    notification,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import AddFormRegistrasi from "../../registrasi/AddFormRegistrasi";
import axios from "axios";
import { baseUrl } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import {
    reduxUpdateNumberIdentifikasi,
    reduxUpdateSelected,
} from "../../../features/mydataselectedSlice";
import { reduxUpdateMatrixSelected } from "../../../features/mymatrixselectedSlice";
import BillingDescriptiom from "../../billing/BillingDescriptiom";
import { getBillingDrivingOrder } from "../../../features/billing/billingdrivingorderSlice";
import { getBillingRestoOrder } from "../../../features/billing/billingrestoorderSlice";
import { useOneRegistrasiData } from "../../../hooks/registrasi/useRegistrasiData";
import dayjs from "dayjs";
import UIAddFormDrivingOrder from "../../registrasidrivingorder/UIAddFormDrivingOrder";
import AddFormReservasi from "../../reservasi/AddFormReservasi";
import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import { useTotalJamRegistrasiDrivinRegisIdData } from "../../../hooks/registrasi/useRegistrasiDrivingData";
import { useUpdateSebagianBayData } from "../../../hooks/useBayData";
import CountdownButton from "../../countdown/CountdownButton";
import { useTotalPaymentData } from "../../../hooks/usePaymentData";
import { reduxGetTotals } from "../../../features/mypaymentSlice";
import EditFormReservasi from "../../reservasi/EditFormReservasi";

let colorCheckIn = "#f0ee97";
let colorPaidOff = "#807D7D";
let colorPlay = "#83FC93";
let colorBooking = "#DACEF8";
let colorFinish = "#D42B4449";
let colorText = "#ffffff";

const GridMatrixReservasi = (props) => {
    let grid;
    // const [api, contextHolder] = notification.useNotification();
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch();

    const [isShowModalReservasi, setisShowModalReservasi] = useState(false);
    const [isShowBill, setisShowBill] = useState(false);
    const [customer, setCustomer] = useState();
    const [nomorRegistrasi, setNomorRegistrasi] = useState();
    const [isShowUIDrivingOrder, setisShowUIDrivingOrder] = useState(false);
    const [isShowModalEditRegistrasi, setIsShowModalEditRegistrasi] =
        useState(false);

    useEffect(() => { }, [customer, nomorRegistrasi]);

    ///HOOKs
    const { mutateAsync: mutateUpdateStatusCheckinToPlayMatrixBay } =
        useUpdateStatusCheckinToPlayMatrixBay();
    const { mutateAsync: mutateUpdateClearCellMatrixbayData } =
        useUpdateClearCellMatrixbayData();
    const {
        data: dataTotalJamDrivingOrder,
        refetch: refetchTotalJamDrivingOrder,
    } = useTotalJamRegistrasiDrivinRegisIdData(customer?.registrasi_id, false);
    const { mutateAsync: mutateUpdateSebagianBayData } =
        useUpdateSebagianBayData();

    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { data: OneRegistrasiData, refetch: refetchOneRegistrasiData } =
        useOneRegistrasiData(nomorRegistrasi, true);
    const { data, isLoading, isError, error } = useMatrixbayDataOrderByDate(
        dayjs(props.tanggal).format("YYYY-MM-DD"),
        true
    );

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

    const tampilkanPesan = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
        });
    };

    /// SYNCFUSION
    const selectionOptions = {
        mode: "Cell",
    };

    const contextMenuItems = [
        // {
        //     text: "Play",
        //     iconCss: "e-icons e-play",
        //     target: ".e-content",
        //     id: "play",
        // },
        {
            text: "Edit Reservasi Data",
            iconCss: "e-icons e-stroke-color",
            target: ".e-content",
            id: "edit-reservasi",
        },
        {
            text: "Clear Booking",
            iconCss: "e-icons e-stroke-color",
            target: ".e-content",
            id: "clear-booking",
        },
    ];

    const contextMenuClick = async (args) => {
        // if (grid && args.item.id === "play") {
        //     // grid.copy(true);
        //     // console.log({
        //     //     baris:customer.id, kolom:customer.namaBay,
        //     //     registrasi_id:customer.registrasi_id,
        //     //     namaCustomer:customer.namaCustomer,
        //     //     status: customer.status
        //     // });

        //     ///isi kembali cell dengan status play
        //     let data = {
        //         isiCell : customer.namaCustomer+",play,"+customer.registrasi_id,
        //         registrasi_id: customer.registrasi_id

        //     }
        //     await mutateUpdateStatusCheckinToPlayMatrixBay([customer.namaBay, data]);
        //     ///END isi kembali cell dengan status play

        //     // ///putar durasinya
        //     // await updateBay(customer.registrasi_id, customer.bay_id);
        // }

        if (grid && args.item.id === "edit-reservasi") {
            // grid.copy(true);
            // console.log(args.rowInfo.rowData);
            // console.log(props.dataParentPO);
            if (customer.registrasi_id !== undefined) {
                setIsShowModalEditRegistrasi(true);
            } else {
                tampilkanPesan("error", "No Display Data");
            }
        }
        if (grid && args.item.id === "clear-booking") {
            console.log({
                a: customer.id,
                b: customer.namaBay,
            });
            await mutateUpdateClearCellMatrixbayData([
                customer.id,
                customer.namaBay,
            ]);
            // grid.copy(true);
            // console.log(args.rowInfo.rowData);
            // console.log(props.dataParentPO);
            // setisShowModal(true);
        }
    };

    const onCellSelected = async (args) => {
        let col = args.cellIndex.cellIndex;
        if (props.end === "10") {
            col = col;
        } else if (props.end === "20") {
            col = col + 10;
        } else if (props.end === "30") {
            col = col + 20;
        } else if (props.end === "40") {
            col = col + 30;
        } else if (props.end === "44") {
            col = col + 40;
        }

        ///***Ini adalah petunjuk jgn dihapus

        // let row = args.cellIndex.rowIndex;
        // console.log(`row : ${row}, col : ${col}`);
        // console.log({
        //     id: args.data.id,
        //     namaCustomer: args.currentCell.innerText,
        //     namaBay: "bay" + col,
        // });

        ///***EndIni adalah petunjuk jgn dihapus

        let id = args.data.id;
        let time = args.data.time;
        let namaCustomer = args.currentCell.innerText;
        let bay_id = col;
        let namaBay = "bay" + col;

        let infoPlayerArray = namaCustomer.split(","); //convert array to object
        let status = infoPlayerArray[1];
        let registrasi_id = infoPlayerArray[2];
        console.log({
            id: id,
            time: time,
            namaCustomer: infoPlayerArray[0],
            bay_id: bay_id,
            namaBay: namaBay,
            status: status,
            registrasi_id: infoPlayerArray[2],
        });

        // console.log("-----cc----");
        // console.log(args.currentCell.innerText);
        // console.log("-----cc----");

        ///utk membuka drawer billing, jika namacustomer di cell tidak bernilai null
        setNomorRegistrasi(registrasi_id);
        setCustomer({
            id: id,
            time: time,
            namaCustomer: infoPlayerArray[0],
            bay_id: bay_id,
            namaBay: namaBay,
            status: status,
            registrasi_id: infoPlayerArray[2],
        });

        ///kirim ke redux
        dispatch(
            reduxUpdateMatrixSelected({
                matrixSelected: {
                    id: id,
                    time: time,
                    namaCustomer: infoPlayerArray[0],
                    bay_id: bay_id,
                    namaBay: namaBay,
                    status: status,
                    registrasi_id: infoPlayerArray[2],
                },
            })
        );

        dispatch(
            reduxUpdateNumberIdentifikasi({
                numberIdentifikasi: infoPlayerArray[2],
            })
        );

        ///cek total jam
        refetchTotalJamDrivingOrder();
    };

    const recordDoubleClick = () => {
        console.log(customer.status);
        // if (customer.status !== undefined && customer.status !== "booking") {
        //     // tampilkan payment
        //     setisShowBill(true);

        //     //ambil informasi registrasi
        //     // console.log(OneRegistrasiData?.data[0]);

        //     if (OneRegistrasiData?.success) {
        //         const id = OneRegistrasiData?.data[0].id;
        //         const date = dayjs(OneRegistrasiData?.data[0].date).format(
        //             "YYYY-MM-DD"
        //         );
        //         const nama = OneRegistrasiData?.data[0].nama;
        //         const no_hp = OneRegistrasiData?.data[0].no_hp;
        //         const alamat = OneRegistrasiData?.data[0].alamat;
        //         dispatch(reduxUpdateNumberIdentifikasi({numberIdentifikasi:customer.registrasi_id}));
        //         dispatch(
        //             reduxUpdateSelected({
        //                 dataSelected: {
        //                     id: id,
        //                     date: date,
        //                     nama: nama,
        //                     no_hp: no_hp,
        //                     alamat: alamat,
        //                 },
        //             })
        //         );
        //     }

        //     //get total driving order
        //     dispatch(getBillingDrivingOrder(nomorRegistrasi));

        //     //get total resto order
        //     dispatch(getBillingRestoOrder(nomorRegistrasi));

        // } else {
        // tampilkan registrasi

        setisShowModalReservasi(true);

        dispatch(reduxUpdateNumberIdentifikasi({ numberIdentifikasi: null }));

        // }
    };

    const queryCellInfo = (args) => {
        if (args.column.field === "time") {
            let waktuServer = dayjs(dataWaktuServer.waktuserver).format("HH");
            if (args.data.time.match(waktuServer)) {
                args.cell.style.color = "#062E6F";
                args.cell.style.fontWeight = "500";
                args.cell.style.backgroundColor = "#23F53F";
            } else {
                args.cell.style.color = "#FAFBFD";
                // args.cell.style.fontWeight = "400";
                args.cell.style.backgroundColor = "#771815";
            }
        }

        if (args.column.field === "bay1") {
            let a = args.data.bay1;

            //jika pake match jgn ada nilai null yang dicari, karna pasti tidak ketemu atau error
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay2") {
            let a = args.data.bay2;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay3") {
            let a = args.data.bay3;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay4") {
            let a = args.data.bay4;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay5") {
            let a = args.data.bay5;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay6") {
            let a = args.data.bay6;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay7") {
            let a = args.data.bay7;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay8") {
            let a = args.data.bay8;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay9") {
            let a = args.data.bay9;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay10") {
            let a = args.data.bay10;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay11") {
            let a = args.data.bay11;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay12") {
            let a = args.data.bay12;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay13") {
            let a = args.data.bay13;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay14") {
            let a = args.data.bay14;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay15") {
            let a = args.data.bay15;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay16") {
            let a = args.data.bay16;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay17") {
            let a = args.data.bay17;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay18") {
            let a = args.data.bay18;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay19") {
            let a = args.data.bay19;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay20") {
            let a = args.data.bay20;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }

        ///21 -40
        if (args.column.field === "bay21") {
            let a = args.data.bay21;

            //jika pake match jgn ada nilai null yang dicari, karna pasti tidak ketemu atau error
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay22") {
            let a = args.data.bay22;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay23") {
            let a = args.data.bay23;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay24") {
            let a = args.data.bay24;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay25") {
            let a = args.data.bay25;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay26") {
            let a = args.data.bay26;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay27") {
            let a = args.data.bay27;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay28") {
            let a = args.data.bay28;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay29") {
            let a = args.data.bay29;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay30") {
            let a = args.data.bay30;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay31") {
            let a = args.data.bay31;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay32") {
            let a = args.data.bay32;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay33") {
            let a = args.data.bay33;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay34") {
            let a = args.data.bay34;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay35") {
            let a = args.data.bay35;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay36") {
            let a = args.data.bay36;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay37") {
            let a = args.data.bay37;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay38") {
            let a = args.data.bay38;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay39") {
            let a = args.data.bay39;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay40") {
            let a = args.data.bay40;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay41") {
            let a = args.data.bay41;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay42") {
            let a = args.data.bay42;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay43") {
            let a = args.data.bay43;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
        if (args.column.field === "bay44") {
            let a = args.data.bay44;
            // Match a string that starts with abc, similar to LIKE 'abc%'
            if (a.match("check-in")) {
                args.cell.style.backgroundColor = colorCheckIn;
            } else if (a.match("paid")) {
                args.cell.style.backgroundColor = colorPaidOff;
                args.cell.style.color = colorText;
            } else if (a.match("booking")) {
                args.cell.style.backgroundColor = colorBooking;
            } else if (a.match("play")) {
                args.cell.style.backgroundColor = colorPlay;
            } else if (a.match("end")) {
                args.cell.style.backgroundColor = colorFinish;
            }
        }
    };

    /// END SYNCFUSION

    // const updateBay = async (regisId, nomorBay) => {
    //     // console.log({Bay:nomorBay, regisId:numberIdentifikasi});
    //     //    let timeStart= dayjs(dataWaktuServer?.waktuserver);
    //     //    let timeEnd = dayjs(dataWaktuServer?.waktuserver).add(qtyDriving, "hour").format("HH:mm:ss")
    //     // let currentTime = dayjs(dataWaktuServer?.waktuserver).add(2, "minute").format("HH:mm:ss");

    //     ///cek totaljam
    //     // refetchTotalJamDrivingOrder();
    //     if (dataTotalJamDrivingOrder?.success) {
    //         let totaljam = dataTotalJamDrivingOrder?.data[0]?.totJam;
    //         let x = {
    //             status: "1",
    //             registrasi_id: regisId,
    //             time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
    //             time_end: dayjs(dataWaktuServer?.waktuserver)
    //                 .add(totaljam, "hour")
    //                 .format("HH:mm:ss"),
    //             time_current: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
    //         };
    //         await mutateUpdateSebagianBayData([nomorBay, x]);
    //         openNotificationDrivingOrder("topRight");
    //     }

    // };

    return (
        <div>
            {contextHolder}
            <GridComponent
                ref={(g) => (grid = g)}
                height="80vh"
                gridLines="Both"
                dataSource={data.data}
                selectionSettings={selectionOptions}
                cellSelected={onCellSelected}
                recordDoubleClick={recordDoubleClick}
                queryCellInfo={queryCellInfo}
                contextMenuItems={contextMenuItems}
                contextMenuClick={contextMenuClick}
            // commandClick={commandClick}
            // dataBound={dataBound}
            // rowHeight={"30"}
            // toolbar={toolbarOptions}
            // toolbarClick={toolbarClick}
            // rowSelected={rowSelected}
            // allowPaging={true}
            // pageSettings={{ pageSizes: true, pageSize: 10 }}
            >
                <Inject
                    services={[
                        Search,
                        Toolbar,
                        CommandColumn,
                        Page,
                        ContextMenu,
                    ]}
                />

                {props.end === "10" && (
                    <ColumnsDirective>
                        <ColumnDirective
                            field="time"
                            headerText="TIME"
                            textAlign="Center"
                            width="100"
                            freeze="Left"
                        // maxWidth={80}
                        />
                        <ColumnDirective
                            field="bay1"
                            headerText="1"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay2"
                            headerText="2"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay3"
                            headerText="3"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay4"
                            headerText="4"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay5"
                            headerText="5"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay6"
                            headerText="6"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay7"
                            headerText="7"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay8"
                            headerText="8"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay9"
                            headerText="9"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay10"
                            headerText="10"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                    </ColumnsDirective>
                )}

                {props.end === "20" && (
                    <ColumnsDirective>
                        <ColumnDirective
                            field="time"
                            headerText="TIME"
                            textAlign="Center"
                            width="100"
                            freeze="Left"
                        // maxWidth={80}
                        />
                        <ColumnDirective
                            field="bay11"
                            headerText="11"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay12"
                            headerText="12"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay13"
                            headerText="13"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay14"
                            headerText="14"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay15"
                            headerText="15"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay16"
                            headerText="16"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay17"
                            headerText="17"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay18"
                            headerText="18"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay19"
                            headerText="19"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay20"
                            headerText="20"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                    </ColumnsDirective>
                )}

                {props.end === "30" && (
                    <ColumnsDirective>
                        <ColumnDirective
                            field="time"
                            headerText="TIME"
                            textAlign="Center"
                            width="100"
                            freeze="Left"
                        // maxWidth={80}
                        />
                        <ColumnDirective
                            field="bay21"
                            headerText="21"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay22"
                            headerText="22"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay23"
                            headerText="23"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay24"
                            headerText="24"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay25"
                            headerText="25"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay26"
                            headerText="26"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay27"
                            headerText="27"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay28"
                            headerText="28"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay29"
                            headerText="29"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay30"
                            headerText="30"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                    </ColumnsDirective>
                )}

                {props.end === "40" && (
                    <ColumnsDirective>
                        <ColumnDirective
                            field="time"
                            headerText="TIME"
                            textAlign="Center"
                            width="100"
                            freeze="Left"
                            maxWidth={100}
                        />
                        <ColumnDirective
                            field="bay31"
                            headerText="31"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay32"
                            headerText="32"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay33"
                            headerText="33"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay34"
                            headerText="34"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay35"
                            headerText="35"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay36"
                            headerText="36"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay37"
                            headerText="37"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay38"
                            headerText="38"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay39"
                            headerText="39"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay40"
                            headerText="40"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                    </ColumnsDirective>
                )}

                {props.end === "44" && (
                    <ColumnsDirective>
                        <ColumnDirective
                            field="time"
                            headerText="TIME"
                            textAlign="Center"
                            width="100"
                            freeze="Left"
                            maxWidth={100}
                        />
                        <ColumnDirective
                            field="bay41"
                            headerText="41"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay42"
                            headerText="42"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay43"
                            headerText="43"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                        <ColumnDirective
                            field="bay44"
                            headerText="44"
                            textAlign="Center"
                            // visible={true}
                            width="120"
                            minWidth={120}
                        />
                    </ColumnsDirective>
                )}
            </GridComponent>

            {/* Drawer Registrasi Entry*/}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowModalReservasi(false)}
                        />
                        <span className="pl-3">Reservasi</span>
                    </>
                }
                placement={"right"}
                closable={false}
                onClose={() => setisShowModalReservasi(false)}
                open={isShowModalReservasi}
                key={"registrasi-entry"}
                styles={{
                    header: {
                        background: "#445E88",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                width={610}
            >
                <Card title="Reservasi Entry" size="small">
                    <AddFormReservasi
                        tanggal={props.tanggal}
                        closeModal={() => setisShowModalReservasi(false)}
                    />
                    {/* <TabTableRegistrasi /> */}
                </Card>
            </Drawer>
            {/* END Drawer Registrasi Entry*/}

            {/* Drawer BILL */}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowBill(false)}
                        />
                        <span className="pl-3">Details</span>
                    </>
                }
                placement={"bottom"}
                closable={false}
                onClose={() => setisShowBill(false)}
                open={isShowBill}
                key={"bill"}
                styles={{
                    header: {
                        background: "#618264",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                // width={800}
                height={"95%"}
            >
                <BillingDescriptiom closeModal={() => setisShowBill(false)} />
            </Drawer>
            {/* Drawer End BILL */}

            {/* Drawer UI Driving Order */}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowUIDrivingOrder(false)}
                        />
                        <span className="pl-3">Details</span>
                    </>
                }
                placement={"bottom"}
                closable={false}
                onClose={() => setisShowUIDrivingOrder(false)}
                open={isShowUIDrivingOrder}
                key={"ui-driving-order"}
                styles={{
                    header: {
                        background: "#618264",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                // width={800}
                height={"95%"}
            >
                <UIAddFormDrivingOrder />
            </Drawer>
            {/* Drawer UI Driving Order */}

            {/* MODAL SHOW EDIT REGISTRASI */}
            <Modal
                onCancel={() => setIsShowModalEditRegistrasi(false)}
                open={isShowModalEditRegistrasi}
                closeIcon={false}
                footer={false}
            >
                <EditFormReservasi
                    closeModal={() => setIsShowModalEditRegistrasi(false)}
                />
            </Modal>
            {/* END MODAL SHOW EDIT REGISTRASI */}
        </div>
    );
};

export default GridMatrixReservasi;
