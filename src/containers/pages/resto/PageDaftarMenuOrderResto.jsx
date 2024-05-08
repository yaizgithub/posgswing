import {
	Avatar,
	Badge,
	Button,
	Card,
	Divider,
	FloatButton,
	Image,
	Input,
	List,
	Modal,
	Skeleton,
	Space,
	Table,
	Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { usePackageRestoData } from "../../../hooks/usePackageRestoData";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import { useDispatch, useSelector } from "react-redux";
import PageAddIncrement from "../matrix/PageAddIncrement";
import { FaCartShopping } from "react-icons/fa6";
import TableRegistrasiResto from "../../../components/registrasirestoorder/TableRegistrasiResto";
import { useRegistrasiRestoOrderByRegistrasiIdAndItemData } from "../../../hooks/registrasi/useRegistrasiRestoData";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;
const { TextArea } = Input;

const PageDaftarMenuOrderResto = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { matrixSelected } = useSelector((state) => state.mymatrixselected);

	const [searchText, setSearchText] = useState("");

	/// State untuk menyimpan produk yang telah difilter
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [isShowModalAddQty, setIsShowModalAddQty] = useState(false);
	const [selectedData, setSelectedData] = useState();
	const [itemSelected, setItemSelected] = useState({
		id: "",
		name: "",
		price: 0,
		image: "",
	});
	const [showKeranjang, setShowKeranjang] = useState(false);

	///HOOKs
	const {
		data: dataPackageResto,
		isLoading,
		isError,
		error,
	} = usePackageRestoData(true);

	useEffect(() => {
	  if (matrixSelected.registrasi_id === undefined) {
		navigate('/registrasi');
	  }
	}, [])
	

	useEffect(() => {
		// console.log(matrixSelected);
		dispatch(
			reduxUpdateTitle({
				rTitle: "F&B Order",
			})
		);
		if (dataPackageResto) {
			// console.log(dataPackageResto?.data);
			setFilteredProducts(dataPackageResto?.data);
			filterProductsByItemsName("");
		}
	}, [dispatch, dataPackageResto?.data]);

	useEffect(() => {}, [selectedData, filteredProducts]);

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

	const columns = [
		{
			// title: 'Items',
			// dataIndex: 'name',
			key: "1",
			width: "250px",
			filteredValue: [searchText],
			onFilter: (value, record) => {
				return (
					String(record.id)
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					String(record.name)
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					String(record.class_menu)
						.toLowerCase()
						.includes(value.toLowerCase())
					// record.categori_menu === value ||
					// record.class_menu === value
				);
			},
			render: (_, record) => {
				return (
					<div className="flex justify-start items-center gap-3">
						<div>
							<Image
								preview={true}
								src={record.image}
								width={70}
								height={70}
								style={{ borderRadius: "10px" }}
							/>
						</div>
						<div>
							<div>{record.name}</div>
							<div>{record.price}</div>
						</div>
					</div>
				);
			},
		},
		{
			// title: 'Price',
			// dataIndex: 'id',
			align: "right",
			key: "2",
			render: (_, record) => {
				return <PageAddIncrement record={record} />;
			},
		},
	];

	// Fungsi untuk melakukan filter array objek berdasarkan kategori
	const filterProductsByItemsName = (value) => {
		const filteredProducts = dataPackageResto?.data.filter((product) =>
			product.name.toLowerCase().includes(value.toLowerCase())
		);
		// console.log(filteredProducts); // Tampilkan hasil filter di konsol
		setFilteredProducts(filteredProducts); // Update state filteredProducts
	};

	const filterProductsByCategory = (value) => {
		const filteredProducts = dataPackageResto?.data.filter((product) =>
			product.categori_menu.toLowerCase().includes(value.toLowerCase())
		);
		// console.log(filteredProducts); // Tampilkan hasil filter di konsol
		setFilteredProducts(filteredProducts); // Update state filteredProducts
	};

	return (
		<div>
			{/* Button Keranjang */}
			<FloatButton
				icon={<FaCartShopping />}
				onClick={() => setShowKeranjang(true)}
			/>
			{/* END Button Keranjang */}
			<div className="mb-3 text-center uppercase font-semibold">
				{matrixSelected.namaBay} - {matrixSelected.namaCustomer}
			</div>

			<div className="mb-3 text-center">
				<Space>
					<Button onClick={() => filterProductsByCategory("F")}>
						Foot
					</Button>
					<Button onClick={() => filterProductsByCategory("B")}>
						Beverages
					</Button>
				</Space>
			</div>

			<div className="mb-3 md:w-[300px] md:text-right">
				<Input.Search
					placeholder="Search here..."
					onSearch={(value) => {
						// setSearchText(value);
						filterProductsByItemsName(value);
					}}
				/>
			</div>

			{/* <Button onClick={resetFilter}>Reset</Button>       */}
			<List
				grid={{
					gutter: 16,
					xs: 2, // Jumlah kolom pada tampilan ekstra kecil (<= 576px)
					sm: 2, // Jumlah kolom pada tampilan kecil (>= 576px)
					md: 4, // Jumlah kolom pada tampilan sedang (>= 768px)
					lg: 5, // Jumlah kolom pada tampilan besar (>= 992px)
					xl: 6, // Jumlah kolom pada tampilan sangat besar (>= 1200px)
					xxl: 9, // Jumlah kolom pada tampilan ekstra besar (>= 1600px)
				}}
				dataSource={filteredProducts}
				renderItem={(item) => (
					<List.Item>
						<Card
							hoverable
							style={{
								width: 170,
							}}
							cover={
								<Image
									preview={false}
									src={item.image}
									// width={180}
									height={170}
									style={{ borderRadius: "10px" }}
								/>
							}
							onClick={() => {
								if (matrixSelected.registrasi_id) {
									setSelectedData(item);
									setItemSelected(item);
									setIsShowModalAddQty(true);									
								} else {
									alert('Maaf halaman ini akan di reload ulang');
									navigate('/registrasi');
								}
							}}
						>
							{/* <Meta
								title={item.name}
								description={item.price}
							/> */}
							<div className="-mt-3">{item.name}</div>
							<div className="-mb-3 font-semibold">
								{/* subtotal = (item.hrg_jual * 1) */}
								{/* srvcharge = ((item.hrg_jual * 1) * (10/100))*/}
								{/* pb1 = (((item.hrg_jual * 1) + ((item.hrg_jual * 1) * (10/100)))*(10/100)) */}
								{/* ((item.hrg_jual * 1) + ((item.hrg_jual * 1) * (10/100)) + (((item.hrg_jual * 1) + ((item.hrg_jual * 1) * (10/100)))*(10/100))).toLocaleString("id-ID") */}
								{item.price}
							</div>
						</Card>
					</List.Item>
				)}
			/>
			{/* <div className="flex flex-wrap justify-center items-start gap-7">
				<div className="md:overflow-y-scroll h-[590px]">
					<Table
						rowKey="id"
						// scroll={{
						//     y: 590,
						// }}
						pagination={false}
						// dataSource={isClassMenuClick ? dataPackageRestoOrderByKategoriAndClass?.data : dataPackageRestoOrderByKategori?.data}
						dataSource={filteredProducts}
						columns={columns}
						style={{ width: "390px" }}
					/>

					<div className="md:hidden">
						<Button
							block
							style={{
								height: "55px",
								backgroundColor: "#F89421",
								color: "#ffffff",
								fontWeight: "bold",
							}}
							// onClick={onClickLihatPesanan}
						>
							Lihat Pesanan
						</Button>
					</div>
				</div>

			</div> */}
			<Modal
				open={isShowModalAddQty}
				footer={false}
				closeIcon={false}
				onCancel={() => setIsShowModalAddQty(false)}
			>
				<div className="text-center">
					<PageAddIncrement
						record={selectedData}
						itemSelected={itemSelected}
						closeModal={() => setIsShowModalAddQty(false)}
					/>
				</div>
			</Modal>
			<Modal
				open={showKeranjang}
				footer={false}
				closeIcon={false}
				onCancel={() => setShowKeranjang(false)}
			>
				<TableRegistrasiResto closeModal={() => setShowKeranjang(false)}/>
			</Modal>
		</div>
	);
};

export default PageDaftarMenuOrderResto;
