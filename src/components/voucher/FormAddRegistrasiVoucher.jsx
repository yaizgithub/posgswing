import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Form,
    Image,
    Input,
    QRCode,
    Space,
    Upload,
    message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Webcam from "react-webcam";
import axios from "axios";
import { baseUrl } from "../../config";
import { useForm } from "antd/es/form/Form";
import CryptoJS from "crypto-js";
import Deskripsi from "./Deskripsi";
import { useSelector } from "react-redux";
import { useOneRegistrasiVoucherData, usePostRegistrasiVoucherData, useRegistrasiVoucherData, useUpdateImageRegistrasiVoucherData } from "../../hooks/voucher/useRegistrasiVoucher";

const secretKey = "YaizJie@2024-GSwing";

const FormAddRegistrasiVoucher = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = useForm();
    const [fileList, setFileList] = useState([]);
    const webcamRef = useRef(null);

    const {userid} = useSelector((state)=>state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [encryptId, setEncryptId] = useState();
    const [capturedImage, setCapturedImage] = useState("https://fakeimg.pl/500x350/");

    ///HOOKs
    const {mutateAsync: mutatePostRegistrasiVoucher} = usePostRegistrasiVoucherData();
    const {mutateAsync: mutateUpdateImageRegistrasiVoucher} = useUpdateImageRegistrasiVoucherData();


    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        const blob = dataURItoBlob(imageSrc);
        const file = new File([blob], "avatar.png", { type: "image/png" });
        setFileList([file]);
    };

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        return new Blob([arrayBuffer], { type: mimeString });
    };



    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };



    const onFinish = async (v) => {
        // console.log(v);
        setIsLoading(true);
        await axios
            .get(baseUrl + `/voucher/generate`)
            .then(async (res) => {
                // console.log(res.data.data);
                let registrasiNumber = res.data.data;

                const encryptedText = CryptoJS.AES.encrypt(
                    registrasiNumber,
                    secretKey
                ).toString();                
                const encoded = btoa(encryptedText); // Encode hasil enkripsi menggunakan base64
                setEncryptId(encoded);
                form.setFieldsValue({ id: encoded });
                
                let data = {
                    id:encoded,
                    nama:v.nama,
                    no_hp:v.no_hp,
                    user_id:userid,
                    updator:userid,
                }
                await mutatePostRegistrasiVoucher(data);                

                setIsLoading(false);
            })
            .catch((err) => {
                alert("error");
                setIsLoading(false);
            });
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("image", file);
        });

        try {
            await axios.post(baseUrl + `/upload`, formData)
            .then(async(res)=>{
                let imageName = res.data.image;
                // console.log({id: encryptId, image: res.data.image});
                    let data={
                        image:imageName
                    }
                    await mutateUpdateImageRegistrasiVoucher([encryptId, data]);
                })
                messageApi.success("Gambar berhasil diunggah ke server.");
                
        } catch (error) {
            messageApi.error("Gagal mengunggah gambar.");
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    const handleInputHandphoneChange = (event) => {
        // Memastikan bahwa input hanya berupa angka telepon
        const value = event.target.value.replace(/\D/g, "");
        // console.log(value); // Cetak nilai input di konsol
        form.setFieldsValue({ no_hp: value });
    };

    return (
        <div>
            {contextHolder}
            <div className="flex flex-wrap justify-center items-center gap-10 mb-3">
                <div>
                    <Form
                        form={form}
                        name="regis-voucher"
                        labelCol={{
                            // offset: 1,
                            span: 4,
                        }}
                        wrapperCol={{
                            // offset: 1,
                            span: 6,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div>
                            <Form.Item
                                hidden
                                label="ID"
                                name="id"
                            >
                                <Input style={{ width: "120px" }} />
                            </Form.Item>
                            <Form.Item
                                label="Name"
                                name="nama"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input style={{ width: "300px" }} />
                            </Form.Item>
                            <Form.Item
                                label="No. Hp"
                                name="no_hp"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input
                                    onChange={handleInputHandphoneChange}
                                    style={{ width: "200px" }}
                                />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 1, span: 16 }}>
                                <Space>
                                    <Button
                                        // disabled={isDisabled}
                                        type="primary"
                                        htmlType="submit"
                                        loading={isLoading}
                                        style={{ width: 100 }}
                                    >
                                        Save
                                    </Button>
                                    <Button onClick={onReset} type="text">
                                        Clear
                                    </Button>
                                </Space>
                            </Form.Item>
                        </div>
                    </Form>
                </div>

                <div>
                    <QRCode value={encryptId || "-"} />
                    {/* <Deskripsi /> */}
                </div>
                
            </div>
            <div>
                <div className="flex justify-start items-start gap-7 mb-3">
                    <div>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={500}
                        //   height={350}
                        />
                    </div>
                    <div>
                        <Image
                            // width={500}
                            src={capturedImage}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex justify-start items-start gab-3">
                        <Button onClick={handleCapture}>Ambil Gambar</Button>
                        <Upload
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={() => false} // Disable default upload behavior
                        >
                            <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
                        </Upload>
                    </div>
                </div>
                <div className="mt-3">
                    <Button onClick={handleUpload}>Unggah</Button>
                </div>
            </div>
        </div>
    );
};

export default FormAddRegistrasiVoucher;
