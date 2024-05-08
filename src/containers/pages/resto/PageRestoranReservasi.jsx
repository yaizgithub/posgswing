import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { reduxUpdateTitle } from '../../../features/titleSlice';


const PageRestoranReservasi = () => {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(
          reduxUpdateTitle({
              rTitle: "F&B Reservasi",
          })
      );
  }, [dispatch]);


  return (
    <div>
        XXX
    </div>
  )
}

export default PageRestoranReservasi