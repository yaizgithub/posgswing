import {
	Button,
	Card,
	Divider,
	Flex,
	Modal,
	Popconfirm,
	Skeleton,
	Table,
	notification,
} from "antd";
import React, { useRef, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getOnePackageResto } from "../../features/packageresto/onepackagerestoSlice";
import {
	useDeleteRegistrasiRestoData,
	useGetTotalItemsTransaksiRestoData,
	useRegistrasiRestoOrderByRegistrasiIdData,
	useUpdateStatusWhereNullRegistrasiRestoData,
} from "../../hooks/registrasi/useRegistrasiRestoData";
import EditRegisFormRestoOrder from "./EditRegisFormRestoOrder";
import { useReactToPrint } from "react-to-print";
import PagePrintRestoOrder from "../../containers/pages/resto/PagePrintRestoOrder";
import { render, Printer, Text } from "react-thermal-printer";
import net from "net"; // Ubah import dari 'node:net' menjadi 'net'
import { baseUrl, baseUrlPrinter } from "../../config";
import axios from "axios";
import copy from 'clipboard-copy';

const TableRegistrasiResto = (props) => {
	const childRef = useRef();
	var nf = new Intl.NumberFormat();
	const dispatch = useDispatch();
	const [api, contextHolder] = notification.useNotification();

	const { numberIdentifikasi } = useSelector((state) => state.mydataselected);
	const { matrixSelected } = useSelector((state) => state.mymatrixselected);
	const { userid } = useSelector((state) => state.auth);

	const [isLoading, setIsLoading] = useState();
	const [selectedData, setSelectedData] = useState();
	const [isShowEditRestoOrder, setIsShowEditRestoOrder] = useState(false);
	const [isShowPrint, setisShowPrint] = useState(false);
	const [copied, setCopied] = useState(false);

	///HOOKs
	const {
		data,
		isLoading: isLoadingData,
		isError,
		error,
	} = useRegistrasiRestoOrderByRegistrasiIdData(numberIdentifikasi, true);
	const { data: dataGetTotalItemsTransaksiResto } =
		useGetTotalItemsTransaksiRestoData(numberIdentifikasi, true);
	const { mutateAsync: mutateDeleteRegistrasiRestoData } =
		useDeleteRegistrasiRestoData();
	const { mutateAsync: mutateUpdateStatusWhereNullRegistrasiResto } =
		useUpdateStatusWhereNullRegistrasiRestoData();

	const handlePrint = useReactToPrint({
		content: () => childRef.current, // Menggunakan ref dari komponen anak
		onBeforePrint: () => setisShowPrint(false),
	});

	if (isLoadingData) {
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

	const openNotification = (description) => {
		api.info({
			message: `Informasi`,
			description: description,
			placement: "topRight",
		});
	};

	const openNotificationError = (description) => {
		api.error({
			message: `Error`,
			description: description,
			placement: "topRight",
		});
	};

	const handleCopyClick = () => {
		copy(numberIdentifikasi)
		  .then(() => {
			setCopied(true);
			// Tambahkan logika lain setelah menyalin ke clipboard
		  })
		  .catch(err => {
			alert('Error copying to clipboard');
			// console.error('Error copying to clipboard:', err);
			// Tambahkan penanganan kesalahan jika diperlukan
		  });
	  };

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
		// {
		//     title: "No.",
		//     key:"index",
		//     render:(value, item, index) => index+1
		// },
		{
			title: "items_name",
			dataIndex: "items_name",
			key: "items_name",
		},
		{
			title: "qty",
			dataIndex: "qty",
			key: "qty",
			align: "right",
			render: (value) => {
				return value.toLocaleString("id");
			},
		},
		// {
		//     title: "Price",
		//     dataIndex: "hrg_jual",
		//     key: "hrg_jual",
		//     align: "right",
		//     render: (value) => {
		//         return value.toLocaleString("id");
		//     },
		// },
		{
			title: "Amount",
			dataIndex: "total",
			key: "total",
			align: "right",
			render: (value) => {
				return value.toLocaleString("id");
			},
		},
		{
			title: "Remark",
			dataIndex: "remark",
			key: "remark",
		},
		{
			title: "Action",
			key: "action",
			render: (_, record) => {
				// console.log(record);
				// setDataTerpilih(record);
				// dispatch(reduxUpdateSelected({ dataSelected: record }));
				return (
					<Popconfirm
						title="Delete Registrasi Data"
						description={`Are you sure to delete ${record.id} ?`}
						onConfirm={() =>
							mutateDeleteRegistrasiRestoData(record.id)
						}
						// onCancel={cancel}
						okText="Yes"
						cancelText="No"
					>
						<Button
							disabled={
								record.status_order === "0" ? true : false
							}
							icon={<DeleteOutlined />}
							shape="circle"
							type="text"
							size="small"
						/>
					</Popconfirm>
				);
			},
		},
	];

	const cetakKeKitchen = async (targetPrinter, message) => {
		///cari ip printer
		await axios
			.get(baseUrl + `/printer/${targetPrinter}`)
			.then(async (res) => {
				///jika ditemukan ambil ip addressnya
				const ipPrinter = res.data.data[0].ip_address;
				// console.log(ipPrinter);

				///print ke dapur
				await axios
					.get(
						baseUrlPrinter +
							`/transaksi-resto/cetakkekitchen?registrasi_id=${matrixSelected.registrasi_id}&target_printer=${targetPrinter}&ip_printer=${ipPrinter}`
					)
					.then((res) => {
						// console.log(res.data.success);
						if (res.data.success) {
							openNotification(message);
						}
					})
					.catch((err) => {
						console.log(err.response.data);
						openNotificationError(err.response.data);
						setIsLoading(false);
					});
			})
			.catch((err) => console.log(err));
	};

	const cetakKeTamu = async () => {
		///cari ip printer
		await axios
			.get(baseUrl + `/printer/X`)
			.then(async (res) => {
				///jika ditemukan ambil ip addressnya
				const ipPrinter = res.data.data[0].ip_address;
				// console.log(ipPrinter);

				///print ke kasir
				await axios
					.get(
						baseUrlPrinter +
							`/transaksi-resto/cetakketamu?registrasi_id=${matrixSelected.registrasi_id}&ip_printer=${ipPrinter}`
					)
					.then(async () => {
						// ///simpan data registrasi resto order
						// let data = {
						// 	status_order: "0",
						// 	updator: userid,
						// };
						// await mutateUpdateStatusWhereNullRegistrasiResto([
						// 	matrixSelected.registrasi_id,
						// 	data,
						// ]);
						// // openNotification("topRight");
						// setIsLoading(false);
					})
					.catch((err) => {
						console.log(err.response.data);
						openNotificationError(err.response.data);
						setIsLoading(false);
					});
			})
			.catch((err) => console.log(err));
	};

	const onClickProses = async () => {
		setIsLoading(true);
		// handleCopyClick();
		// // window.open('http://localhost:3000', '_blank');
		// // window.open('http://localhost:3000');
		// window.open('https://printorder.yaiz.site');
		// props.closeModal();

		await cetakKeKitchen("F", "Pesanan diteruskan ke kitchen");
		await cetakKeKitchen("B", "Pesanan diteruskan ke bar");
		await cetakKeTamu();

		///simpan data registrasi resto order
		let data = {
			status_order: "0",
			updator: userid,
		};
		await mutateUpdateStatusWhereNullRegistrasiResto([
			matrixSelected.registrasi_id,
			data,
		]);
		// openNotification("topRight");
		setIsLoading(false);
		
	};

	const onClickTestPrint = async () => {
		// const data = await render(
		//     <Printer type="epson">
		//         <Text>Hello World</Text>
		//     </Printer>
		// );
		// const conn = net.connect({
		//     host: '192.168.88.42',
		//     port: 9100,
		//     timeout: 3000,
		// }, () => {
		//     conn.write(Buffer.from(data), () => {
		//         conn.destroy();
		//     });
		// });
	};

	return (
		<div>
			{contextHolder}
			<Table
				rowKey="id"
				pagination={false}
				size="small"
				dataSource={data?.data}
				columns={columns}
				onRow={(record, rowIndex) => {
					return {
						onClick: (event) => {
							// console.log(record);
						}, // click row
						onDoubleClick: (event) => {
							if (record.status_order === null) {
								setIsShowEditRestoOrder(true);
								setSelectedData(record);
								dispatch(getOnePackageResto(record.items_id));
							}
						},
					};
				}}
				rowClassName={"custom-table-row custom-height-table-row"}
			/>

			<Divider>Total</Divider>

			<div className="mx-2">
				<Flex justify="space-between" className="mb-2">
					<div>Items</div>
					<div>
						{dataGetTotalItemsTransaksiResto?.data[0].totQty ?? 0}
					</div>
				</Flex>
				{/* <Flex justify="space-between">
                    <div>Amount</div>
                    <div>Rp. {dataGetTotalItemsTransaksiResto?.data[0].sumTotal ?? 0}</div>
                </Flex>                   */}
			</div>
			<div className="mt-10">
				<Button
					onClick={onClickProses}
					block
					type="primary"
					loading={isLoading}
					style={{ height: "45px" }}
				>
					 {/* {copied ? 'Copied!' : 'Copy to Clipboard'} */}
					 Proses
				</Button>
			</div>
			{/* <div className="mt-2">
                <Button onClick={() => { setisShowPrint(true); }} block>
                    print
                </Button>
            </div>
            <div className="mt-2">
                <Button onClick={onClickTestPrint}>Test Print</Button>
            </div> */}

			{/* Modal Registrasi Resto Order */}
			<Modal
				open={isShowEditRestoOrder}
				onCancel={() => setIsShowEditRestoOrder(false)}
				footer={false}
			>
				<Card title="Update Resto Order" size="small">
					<EditRegisFormRestoOrder
						selectedData={selectedData}
						closeModal={() => setIsShowEditRestoOrder(false)}
						discHidden={true}
					/>
				</Card>
			</Modal>
			{/* END Modal Registrasi Resto Order */}

			{/* MODAL SHOW PRINT */}
			{/* <Modal
                open={isShowPrint}
                onCancel={() => setisShowPrint(false)}
                footer={false}
                width={300}
            >
                <Button onClick={handlePrint} block>
                    print
                </Button>
                <div ref={childRef} className="mt-3">
                    <PagePrintRestoOrder />
                    <PagePrintRestoOrder />
                </div>
            </Modal> */}
			{/* END MODAL SHOW PRINT */}
		</div>
	);
};

export default TableRegistrasiResto;
