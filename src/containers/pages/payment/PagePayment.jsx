import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { reduxUpdateTitle } from '../../../features/titleSlice';
import TableRegistrasi from '../../../components/registrasi/TableRegistrasi';
import { Card, Tabs } from 'antd';

import ViewTablePayment from '../../../components/payment/ViewTablePayment';
import DetailsDrivingOrder from './DetailsDrivingOrder';
import DetailsRestoOrder from './DetailsRestoOrder';

const PagePayment = () => {

    const dispatch = useDispatch();

    // const {dataSelected} = useSelector((state)=>state.mydataselected);

    const [registrasiID, setRegistrasiID] = useState();

    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "Payment",
            })
        );
    }, [dispatch]);

    const items = [
        {
          key: '1',
          label: 'Driving',
          children: <DetailsDrivingOrder registrasiID={registrasiID}/>,
        },
        {
          key: '2',
          label: 'F%B',
          children: <DetailsRestoOrder registrasiID={registrasiID}/>,
        },
        
      ];

    return (
        <div>            
            <TableRegistrasi recordSelectedID={(regisId)=>{setRegistrasiID(regisId)}}/>    
            <div className='mt-5'>
                <Card title="Details Transaksi" size='small'>
                <Tabs defaultActiveKey="1" items={items} />
                </Card>
            </div>        
            {/* <div className='mt-5'>
                <Card title="Detail Payment" size='small' styles={{header:{backgroundColor:"#F8F6F4"}}}>
                    <ViewTablePayment registrasiID={registrasiID}/>
                </Card>
            </div> */}
        </div>
    )
}

export default PagePayment