import { Input, InputNumber, Select } from "antd";
import React, {

    useEffect,

    useState,
} from "react";
import { baseUrl } from "../../../config";
import axios from "axios";
import { usePostSplitBillData } from "../../../hooks/useSplitBill";

const { Option } = Select;

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const InputPembagian = (props, ref) => {

    const [subTotal, setSubTotal] = useState(0);
    const [hasil, setHasil] = useState(0);

    const [selectedValues, setSelectedValues] = useState([]);

    ///HOOKs
    const {mutateAsync : mutatePostSplitBill} = usePostSplitBillData();

    useEffect(() => {
        setSubTotal(props.subTotal);
    }, [props.subTotal]);

    const onChangeJmlOrang = async(v) => {
        // console.log(v);
        let hasil = props.subTotal / v.length;
        setHasil(hasil);
        setSelectedValues(v);
        
        
        ///hapus dulu data split bill  nya
        await axios
            .delete(baseUrl + `/splitbill/${props.index}`)
            .then(async (res) => {
                v.forEach(async (e) => {
                    let data = {
                        registrasi_id:props.registrasi_id,
                        index_data: props.index,
                        nama: e,
                        qty: v.length !== 1 ? 1 : props.qty,
                        items_name: props.itemsName,
                        jumlah: hasil,                        
                        nilai_disc:0,
                        nilai_service_charge:0,
                        nilai_ppn:0,
                        nilai_pb_satu:0,
                    };
                await mutatePostSplitBill(data);    
                });
            })
            .catch((err) => {
                alert(err);
            });
    };

   

    return (
        <div className="flex justify-start items-center">
            <Input value={props.qty} style={{ width:"50px", border: "none" }} />x
            <Input value={props.itemsName} style={{ width:"200px", border: "none" }} />
            <InputNumber
                value={subTotal}
                formatter={formatter}
                parser={parser}
                style={{ width:"90px", border: "none" }}
            />
            {/* <InputNumber
                value={hasil}
                formatter={formatter}
                parser={parser}
                style={{{ width:"90px", border: "none" }}
            /> */}
            <Select
                mode="multiple"
                allowClear
                style={{
                    width: "200px",
                }}
                placeholder="Please select"
                // onChange={handleChange}
                // value={props.daftarNama}
                // options={props.daftarNama}
                onChange={onChangeJmlOrang}
                value={selectedValues}
            >
                {props.daftarNama.map((item, index) => (
                    <Option key={index} value={item}>
                        {item}
                    </Option>
                ))}
            </Select>
            
        </div>
    );
};

export default InputPembagian;
