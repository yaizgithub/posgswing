import React, { useState } from 'react'
import CryptoJS from 'crypto-js';
import { Button, Input } from 'antd';

const Deskripsi = () => {
    
    const [value, setValue] = useState();
        
    const secretKey = "YaizJie@2024-GSwing";



    const onClickDeskripsi=()=>{
        const decoded = atob(value); // Decode teks yang telah dienkripsi menggunakan base64
        const decryptedText = CryptoJS.AES.decrypt(decoded, secretKey).toString(CryptoJS.enc.Utf8);
        console.log(decryptedText);
    }


    const onChangeInput=(e)=>{
        setValue(e.target.value);
    }

  return (
    <div>
        <Input onChange={onChangeInput}/>
        <Button onClick={onClickDeskripsi}>Deskripsi</Button>
    </div>
  )
}

export default Deskripsi