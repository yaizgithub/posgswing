import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { reduxUpdateTitle } from '../../../features/titleSlice';
import ViewRevenueTransaksi from '../../../components/closing/ViewRevenueTransaksi';
import ViewRevenuePayment from '../../../components/closing/ViewRevenuePayment';
import ViewContoh from '../../../components/closing/ViewContoh';

const PageClosing = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "Closing",
            })
        );
    }, [dispatch]);

  return (
    <div>
        <ViewRevenueTransaksi />
        <ViewRevenuePayment />
        {/* <ViewContoh /> */}
    </div>
  )
}

export default PageClosing