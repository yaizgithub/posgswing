import React, { useEffect } from 'react'
import { reduxUpdateTitle } from '../../../features/titleSlice';
import { useDispatch } from "react-redux";
import TableRegistrasi from '../../../components/registrasi/TableRegistrasi';

const PageRegistrasi = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
        reduxUpdateTitle({
            rTitle: "Registrasi",
        })
    );
}, [dispatch]);

  return (
    <div>
      <TableRegistrasi />
    </div>
  )
}

export default PageRegistrasi