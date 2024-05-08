import { Button, Image, Input, Skeleton, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseUrl } from "../../../config";
import {
	usePostRegistrasiRestoData,
	useRegistrasiRestoOrderByRegistrasiIdAndItemData,
	useUpdateRegistrasiRestoData,
} from "../../../hooks/registrasi/useRegistrasiRestoData";

const { TextArea } = Input;

const PageAddIncrement = ({ record, itemSelected, closeModal }) => {
	const [messageApi, contextHolder] = message.useMessage();
	const { userid } = useSelector((state) => state.auth);
	const { matrixSelected } = useSelector((state) => state.mymatrixselected);

	const [qty, setQty] = useState(0);
	const [orderan, setOrderan] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [jumlah, setJumlah] = useState(0);
	const [srvchrg, setSrvchrg] = useState(0);
	const [pbsatu, setPbsatu] = useState(0);
	const [amount, setAmount] = useState(0);
	const [catatan, setCatatan] = useState(null);

	const [params, setParams] = useState([
		matrixSelected.registrasi_id,
		itemSelected.id,
		true,
	]);

	///HOOKs
	const { mutateAsync: dataPostRegistrasiResto } =
		usePostRegistrasiRestoData();
	const {
		data: dataRegisAndItem,
		refetch,
		isLoading: isLoadingData,
		isError,
		error,
	} = useRegistrasiRestoOrderByRegistrasiIdAndItemData(params);
	const { mutateAsync: dataUpdateRegistrasiResto } =
		useUpdateRegistrasiRestoData();

	useEffect(() => {
		if (dataRegisAndItem !== undefined) {
			setQty(dataRegisAndItem?.data[0]?.qty ?? 0);
			handleRefetch([
				matrixSelected.registrasi_id,
				itemSelected.id,
				true,
			]);
			// console.log(dataRegisAndItem?.data);
		}
	}, [itemSelected.id, dataRegisAndItem?.data]);

	useEffect(() => {
		if (dataRegisAndItem !== undefined) {
			rumus();
		}
	}, [orderan, jumlah, srvchrg, pbsatu, amount, qty]);

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

	const successMessage = (type, message) => {
		messageApi.open({
			type: type,
			content: message,
		});
	};

	const rumus = () => {
		let jml = itemSelected.hrg_jual * qty;
		let nilaiSrvChrg = jml * (10 / 100); //service charge adalah 10 persen
		let nilaiPbsatu = (jml + nilaiSrvChrg) * (10 / 100); //pb1 adalah 10 persen
		let bayar = jml + nilaiSrvChrg + nilaiPbsatu;
		setJumlah(jml);
		setSrvchrg(nilaiSrvChrg);
		setPbsatu(nilaiPbsatu);
		setAmount(bayar);
	};

	// Fungsi untuk menambahkan produk ke dalam keranjang
	const addOrderan = (record) => {
		const updatedProducts = [...orderan];
		const existingProductIndex = updatedProducts.findIndex(
			(product) => product.items_id === record.items_id
		);
		if (existingProductIndex !== -1) {
			// Jika produk sudah ada dalam keranjang, tambahkan qty-nya
			updatedProducts[existingProductIndex].qty += 1;
		} else {
			// Jika produk belum ada dalam keranjang, tambahkan produk baru dengan qty 1
			updatedProducts.push({
				items_id: record.id,
				items_name: record.name,
				qty: 1,
				hrg_jual: record.hrg_jual,
			});
		}
		setOrderan(updatedProducts);
	};

	// Fungsi untuk menambah qty produk
	const increment = () => {
		setQty(qty + 1);
		const updatedProducts = [...orderan];
		if (updatedProducts[0]) {
			updatedProducts[0].qty += 1;
			setOrderan(updatedProducts); //ubah nilai dari index ke 0 yaitu qty ditambah 1
		}
	};

	// Fungsi untuk mengurangi qty produk
	const decrement = () => {
		if (qty <= 0) {
			return setQty(0);
		}
		setQty(qty - 1);
		const updatedProducts = [...orderan];
		if (updatedProducts[0] && updatedProducts[0].qty > 0) {
			updatedProducts[0].qty -= 1; //ubah nilai dari index ke 0 yaitu qty dikurangi 1
			setOrderan(updatedProducts);
		}
	};

	const onFinish = async (v) => {
		///1. generate number Registrasi resto order
		await axios
			.get(
				baseUrl +
					`/transaksi-resto/generate?registrasi_id=${matrixSelected.registrasi_id}`
			)
			.then(async (res) => {
				let noUrutOrder = res.data.data;

				setIsLoading(true);
				// let item = onePackageRestoData.data[0];

				let data = {
					id: noUrutOrder,
					registrasi_id: matrixSelected.registrasi_id,
					no_meja: "",
					items_id: record.id,
					qty: qty,
					hrg_jual: record.hrg_jual,
					disc_persen: 0,
					disc_rp: 0,
					nilai_persen: 0,
					nilai_disc: 0,
					hrg_stl_disc: 0,
					service_charge_persen: 10,
					nilai_service_charge: srvchrg,
					pb_satu_persen: 10,
					nilai_pb_satu: pbsatu,
					total: amount,
					// status_order: item.status_order,
					status_order: null,
					remark: catatan,
					user_id: userid,
					updator: userid,
				};
				await dataPostRegistrasiResto(data);
				setIsLoading(false);
				successMessage("success", `Success, ${qty} Pesanan ditambahkan`);
				closeModal();
			})
			.catch((err) => console.log(err));
		///ambil data dari package resto
	};

	const onUpdate = async () => {
		///ambil data dari package resto
		setIsLoading(true);

		let v = dataRegisAndItem?.data[0];

		let data = {
			registrasi_id: matrixSelected.registrasi_id,
			no_meja: "",
			items_id: record.id,
			qty: qty,
			hrg_jual: record.hrg_jual,
			disc_persen: v.disc_persen,
			disc_rp: v.disc_rp,
			nilai_persen: v.nilai_persen,
			nilai_disc: v.nilai_disc,
			hrg_stl_disc: v.hrg_stl_disc,
			service_charge_persen: v.service_charge_persen,
			nilai_service_charge: srvchrg,
			pb_satu_persen: v.pb_satu_persen,
			nilai_pb_satu: pbsatu,
			total: amount,
			// status_order: item.status_order,
			status_order: null,
			remark: catatan,
			updator: userid,
		};
		await dataUpdateRegistrasiResto([v.id, data]);
		setIsLoading(false);
		successMessage("success", `Success, Pesanan diperbaharui`);
		closeModal();
	};

	const handleCatatan = (v) => {
		setCatatan(v.target.value);
	};

	// Fungsi untuk melakukan refetch dengan parameter yang berbeda saat tombol diklik
	const handleRefetch = (newParams) => {
		setParams(newParams); // Atur parameter baru
		refetch(newParams); // Lakukan refetch dengan parameter baru
		console.log(dataRegisAndItem?.data[0]?.qty);
	};

	return (
		<div>
			{contextHolder}
			<div className="">
				<Image
					preview={false}
					src={itemSelected.image}
					width={"100%"}
					height={100}
					style={{ borderRadius: "10px", objectFit: "cover" }}
				/>
				<div className="">
					<div className="flex justify-between">
						<p className="font-semibold">{itemSelected.name}</p>
						<p className="font-semibold">{itemSelected.price}</p>
					</div>
					<div className="flex justify-between">
						<p>Jumlah</p>
						<p>{jumlah.toLocaleString("id")}</p>
					</div>
					<div className="flex justify-between">
						<p>SrvChrg</p>
						<p>{srvchrg.toLocaleString("id")}</p>
					</div>
					<div className="flex justify-between">
						<p>Pb1</p>
						<p>{pbsatu.toLocaleString("id")}</p>
					</div>
					<div className="flex justify-between">
						<p className="font-semibold">Amount</p>
						<p className="font-semibold">
							{amount.toLocaleString("id")}
						</p>
					</div>
				</div>
			</div>

			<div className="mt-5">
				<p className="font-semibold text-left mb-2">Catatan :</p>
				<TextArea
					rows={3}
					placeholder="Optional"
					value={catatan}
					onChange={(v) => handleCatatan(v)}
				/>
			</div>
			<div className="mt-10">
				<Button
					size="default"
					// shape="round"
					onClick={() => {
						decrement();
						rumus();
					}}
					icon={<MinusOutlined size="12px" />}
					style={{ color: "#062E6F" }}
				/>

				<span className="px-5 text-[18px] font-semibold">{qty}</span>

				<Button
					size="default"
					// shape="round"
					onClick={() => {
						addOrderan(record);
						increment();
						rumus();
					}}
					icon={<PlusOutlined size="12px" />}
					style={{ color: "#062E6F" }}
				/>
			</div>
			{qty > 0 ? (
				<div className="mt-10">
					{dataRegisAndItem.status === false ? (
						<Button
							size="large"
							block
							type="primary"
							// style={{ backgroundColor: "#fb8500", color:"white" }}
							onClick={onFinish}
							loading={isLoading}
						>
							Tambah . {qty} Pesanan - Rp
							{amount.toLocaleString("id")}
						</Button>
					) : (
						<Button
							size="large"
							block
							type="primary"
							// style={{ backgroundColor: "#fb8500", color:"white" }}
							onClick={onUpdate}
							loading={isLoading}
						>
							Perbarui Pesanan - Rp{amount.toLocaleString("id")}{" "}
							(Termasuk pajak)
						</Button>
					)}
				</div>
			) : (
				<div className="mt-10">
					<Button
						size="large"
						block
						// type="primary"
						style={{ backgroundColor: "#edede9", color: "#062E6F" }}
						onClick={() => closeModal()}
						loading={isLoading}
					>
						Balik ke Menu
					</Button>
				</div>
			)}
		</div>
	);
};

export default PageAddIncrement;
