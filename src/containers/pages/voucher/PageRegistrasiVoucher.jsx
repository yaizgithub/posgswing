import React, { useEffect } from 'react'
import { reduxUpdateTitle } from '../../../features/titleSlice';
import { useDispatch } from 'react-redux';
import TableRegistrasiVoucher from './TableRegistrasiVoucher';
import FormAddRegistrasiVoucher from '../../../components/voucher/FormAddRegistrasiVoucher';


const PageRegistrasiVoucher = () => {
    const dispatch = useDispatch();    

    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "Voucher Registrasi",
            })
        );
    }, [dispatch]);
  return (
    <div>
        <TableRegistrasiVoucher />        
    </div>
  )
}

export default PageRegistrasiVoucher