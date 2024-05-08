import React, { useEffect } from 'react'
import TableReservasi from '../../../components/reservasi/TableReservasi'
import { useDispatch } from 'react-redux';
import { reduxUpdateTitle } from '../../../features/titleSlice';

const PageReservasi = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
        reduxUpdateTitle({
            rTitle: "Reservasi",
        })
    );
}, [dispatch]);

  return (
    <div>
      <TableReservasi />
    </div>
  )
}

export default PageReservasi