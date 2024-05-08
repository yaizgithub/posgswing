import React, { useState } from "react";
import { Badge, Button, Card, Drawer, Flex, Modal, Radio, Skeleton, Switch } from "antd";
import { useMejaRestoran } from "../../hooks/useMejaData";
import mejaColor from "../../image/mejaColor.png";
import mejaBW from "../../image/mejaBW.png";
import AddFormRestoranRegistrasi from "./AddFormRestoranRegistrasi";
import SwitchButton from "./SwitchButton";
import axios from "axios";
import { baseUrl } from "../../config";
import { FaCartShopping } from "react-icons/fa6";
import PageAddRestoOrder from "../../containers/pages/matrix/PageAddRestoOrder";
import TableRegistrasiResto from "../registrasirestoorder/TableRegistrasiResto";
import { useDispatch } from "react-redux";
import { reduxUpdateMatrixSelected } from "../../features/mymatrixselectedSlice";
import { reduxUpdateNumberIdentifikasi } from "../../features/mydataselectedSlice";
import { useNavigate } from "react-router-dom";

const RestoranRegistrasi = () => {
    const navigate = useNavigate();
    const dispatch= useDispatch();
    const [isShowRestoRegistrasi, setisShowRestoRegistrasi] = useState(false);
    const [noMeja, setNoMeja] = useState();
    const [isShowModalOrderResto, setIsShowModalOrderResto] = useState(false);
    const [isShowModalKeranjang, setIsShowModalKeranjang] = useState(false);

    ///HOOKs
    const { data, isLoading, isError, error } = useMejaRestoran(true);

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

    const onClickRadio = (v) => {
        // console.log(v.target.value);
        setisShowRestoRegistrasi(true);
        setNoMeja(v.target.value);


    };

    const tambahMenu = async(v) => {
                ///cari no.registrasinya
                // console.log(v.target.value);
                let noMeja = v.target.value;
                setNoMeja(noMeja);
            
                await axios.get(baseUrl+`/registrasi/orderbymeja?no_meja=${noMeja}`)
                .then((res)=>{
                    // console.log(res.data.data[0].id);
                    let regisId=res.data.data[0].id;
                    
                    ///kirim ke redux
                    dispatch(
                        reduxUpdateMatrixSelected({
                            matrixSelected: {                                
                                registrasi_id: regisId,
                            },
                        })
                    );
                    dispatch(
                        reduxUpdateNumberIdentifikasi({ numberIdentifikasi: regisId })
                    );

                    ///tampilkan modal
                    // setIsShowModalOrderResto(true);
                    navigate("/tambahpesananresto");
                }).catch((err)=>console.log(err));
    };

    const onClickKeranjang=()=>{
        setIsShowModalKeranjang(true);
    }

    return (
        <div>
            <div>
                <Radio.Group buttonStyle="outline">
                    <div className="flex flex-wrap justify-start items-center gap-3">
                        {data?.data.map((e, key) => {
                            return (
                                <div key={key} >
                                    <Radio.Button
                                        value={e.id}
                                        style={{ height: "200px", width:"350px" }}
                                        onClick={e.status === "0" ? onClickRadio : tambahMenu}
                                        
                                    >
                                        <Flex justify="space-between" align="center">
                                            <div className="mt-1 -ml-2 font-semibol">
                                                <Button
                                                    type="text"
                                                    shape="circle"
                                                    style={{ backgroundColor: "#F5F2C2" }}
                                                >
                                                    {e.id}
                                                </Button>
                                            </div>
                                            <div className="text-slate-500">
                                                {e.status === "0" ? (
                                                    <div className="bg-slate-700 text-white rounded-full px-3">
                                                        Available
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-400 text-white rounded-full px-3">
                                                        In-used
                                                    </div>
                                                )}
                                                {/* <SwitchButton status={e.status} id={e.id}/>  */}
                                            </div>
                                        </Flex>
                                        <div>
                                            {e.status === "0" ? (
                                                <div className="w-[150px] md:w-[120px]">
                                                    <img alt="example" src={mejaBW} />
                                                </div>
                                            ) : (
                                                <div className="w-[150px] md:w-[120px]">
                                                    <img alt="example" src={mejaColor} />
                                                </div>
                                            )}
                                        </div>
                                    </Radio.Button>
                                </div>
                            );
                        })}
                    </div>
                </Radio.Group>
            </div>

            {/* show modal Registrasi Resto */}
            <Drawer
                title="Resto Registrasi"
                width={550}
                open={isShowRestoRegistrasi}
                onClose={() => setisShowRestoRegistrasi(false)}
                // styles={{ header: { backgroundColor: "#1F2544" } }}
                
            >
                <AddFormRestoranRegistrasi noMeja={noMeja} />
            </Drawer>
            {/* END show modal Registrasi Resto */}


            {/* MODAL SHOW ORDER RESTO */}
            <Modal
                width="900px"
                open={isShowModalOrderResto}
                onCancel={() => setIsShowModalOrderResto(false)}
                okText="Proses"
                footer={false}
                style={{ top: "30px" }}
                closable={false}
            // onOk={onClickProses}
            >
                <Card
                    title={`F & B ORDER - Table ${noMeja}`}
                    size="small"
                    styles={{
                        body: { backgroundColor: "#F8F8F8" },
                        header: { backgroundColor: "#92C7CF" },
                    }}
                    extra={
                        <div className="block md:hidden">
                        <Badge count={1} size="small" offset={[-10, 10]}>
                            <Button type="text" shape="circle" onClick={onClickKeranjang}>
                                <FaCartShopping fontSize={"24px"} />
                            </Button>
                        </Badge>
                        </div>
                    }
                >
                    <div className="mt-1">
                        <PageAddRestoOrder
                            closeModal={() => setIsShowModalOrderResto(false)}
                        />
                    </div>
                </Card>
            </Modal>
            {/* END MODAL SHOW ORDER RESTO */}

            {/* MODAL KERANJANG */}
            <Modal
            //  width="900px"
             open={isShowModalKeranjang}
             onCancel={() => setIsShowModalKeranjang(false)}
             okText="Proses"
             footer={false}
             style={{ top: "30px" }}
             closable={false}
            >
                <TableRegistrasiResto />
            </Modal>
            {/* END MODAL KERANJANG */}
        </div>
    );
};

export default RestoranRegistrasi;
