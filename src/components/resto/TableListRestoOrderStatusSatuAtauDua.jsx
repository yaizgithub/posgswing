import React, { useEffect, useState } from "react";
import { Modal, Popconfirm, Table } from "antd";
import {
  useListRestoOrderData,
  useListRestoOrderStatusSatuAtauDuaData,
} from "../../hooks/useListRestoOrderData";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  useUpdateStatusWhereNolRegistrasiRestoData,
  useUpdateStatusWhereSatuToDuaTransaksiRestoData,
} from "../../hooks/registrasi/useRegistrasiRestoData";
import axios from "axios";
import { baseUrl } from "../../config";

const { confirm } = Modal;

const TableListRestoOrderStatusSatuAtauDua = () => {
  const { userid } = useSelector((state) => state.auth);

  const [recordSelected, setRecordSelected] = useState([]);

  ///HOOKs
  const { data } = useListRestoOrderStatusSatuAtauDuaData(true);
  const { mutateAsync: mutateUpdateStatusWhereSatuToDuaTransaksiResto } =
    useUpdateStatusWhereSatuToDuaTransaksiRestoData();

  const showConfirm = (id) => {
    confirm({
      title: "Confirmasi Orderan",
      icon: <ExclamationCircleFilled />,
      content: "Yakin pesanan sudah selesai?",
      okText: "Ya",
      okType: "info",
      cancelText: "Tidak",
      onOk() {
        updateStatusOrderan(id);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  useEffect(() => {}, [recordSelected]);

  const columns = [
    // {
    //     title: "id",
    //     dataIndex: "id",
    //     key: "id",
    //     filteredValue: [searchText],
    //     onFilter: (value, record) => {
    //         let status = record.status;
    //         if (status === "0") {
    //             status = "open";
    //         } else if (status === "1") {
    //             status = "release";
    //         }
    //         return (
    //             String(record.id).toLowerCase().includes(value.toLowerCase()) ||
    //             String(dayjs(record.date).format("DD/MM/YYYY"))
    //                 .toLowerCase()
    //                 .includes(value.toLowerCase()) ||
    //             String(record.nama).toLowerCase().includes(value.toLowerCase()) ||
    //             String(record.no_hp).toLowerCase().includes(value.toLowerCase()) ||
    //             String(record.alamat).toLowerCase().includes(value.toLowerCase()) ||
    //             String(record.time).toLowerCase().includes(value.toLowerCase()) ||
    //             String(record.bay).toLowerCase().includes(value.toLowerCase()) ||
    //             String(record.sales).toLowerCase().includes(value.toLowerCase())
    //         );
    //     },
    // },

    {
      title: "No.",
      key: "index",
      render: (value, item, index) => index + 1,
      // render={(value, item, index) => (page - 1) * 10 + index}
    },
    {
      title: "Bay",
      dataIndex: "bay",
      key: "bay",
    },
    {
      title: "Meja",
      dataIndex: "noMejaRestoran",
      key: "noMejaRestoran",
    },
    // {
    //     title: "Customer",
    //     dataIndex: "nama",
    //     key: "nama",
    // },
    {
      title: "Items",
      dataIndex: "items_name",
      key: "items_name",
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "right",
      // render: (value) => {
      //     return value.toLocaleString("id");
      // },
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "Status",
      dataIndex: "status_order",
      key: "status_order",
      render: (_, record) => {
        // return <div>{record.status_order === '1' ? 'Ready' : record.status_order === 0 ? 'blm dibuat':'X'}</div>
        return (
          <div>
            {record.status_order === "0" ? (
              "waiting"
            ) : record.status_order === "1" ? (
              <div className="bg-yellow-200 rounded-sm text-yellow-700 text-center">
                process
              </div>
            ) : record.status_order === "2" ? (
              <div className="bg-green-200 rounded-sm text-green-900 text-center">
                ready
              </div>
            ) : (
              <div className="bg-red-200 rounded-sm text-red-900 text-center">
                finish
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const ambilTokenFcmDariDatabase = async () => {
    await axios
      .get(baseUrl + "/tokenfcm")
      .then(async (res) => {
        // console.log(res.data.data);
        const dataToken = res.data.data;

        // Mengkonversi array object menjadi array biasa
        const arrayFromObjects = dataToken.map((item) => item.id);
        await showFirebaseCloudMessaging(arrayFromObjects);
      })
      .catch((err) => console.log(err));
  };

  const showFirebaseCloudMessaging = async (tokenfcm) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=AAAAqn2xQeA:APA91bHjaG9N2f3JCJbZO22uoxId1ubaX89JY7KJWFo4gGQKh1xc5w4TyTxwTeBYmKtzWtW4rpRaH6m0lxPaM7RKTK__lwpJIpXJMqa-xto8ANi_xyFbcQmtRjnxaTLxuFNyXJO9qPmN`,
        // Tambahkan header lain jika diperlukan
      },
    };

    if (recordSelected.bay !== undefined) {
      const data = {
        registration_ids: tokenfcm,
        notification: {
          title: `Orderan Bay ${recordSelected.bay}`,
          body: `Pesanan siap diantar ke bay ${recordSelected.bay}`,
        },
      };

      await axios
        .post("https://fcm.googleapis.com/fcm/send", data, config)
        .then((res) => {
          // // Penanganan respons
          // console.log(res.data);
        })
        .catch((err) => {
          // Penanganan kesalahan
          console.error(err);
        });
    } else {
      const data = {
        registration_ids: tokenfcm,
        notification: {
          title: `Orderan Meja ${recordSelected.noMejaRestoran}`,
          body: `Pesanan siap diantar ke meja ${recordSelected.noMejaRestoran}`,
        },
      };

      await axios
        .post("https://fcm.googleapis.com/fcm/send", data, config)
        .then((res) => {
          // // Penanganan respons
          // console.log(res.data);
        })
        .catch((err) => {
          // Penanganan kesalahan
          console.error(err);
        });
    }
  };

  const updateStatusOrderan = async (id) => {
    // console.log(id);
    let data = {
      status_order: "2",
      updator: userid,
    };
    await mutateUpdateStatusWhereSatuToDuaTransaksiResto([id, data]);
    ambilTokenFcmDariDatabase();
  };

  return (
    <div>
      <Table
        pagination={false}
        size="middle"
        dataSource={data?.data}
        columns={columns}
        rowKey="id"
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // console.log(record);
            }, // click row
            onDoubleClick: (event) => {
              showConfirm(record.id);
              setRecordSelected(record);
              // console.log(record);
            },
          };
        }}
        rowClassName={"custom-table-row"}
      />
    </div>
  );
};

export default TableListRestoOrderStatusSatuAtauDua;
