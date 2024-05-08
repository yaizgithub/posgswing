import React, { useEffect } from 'react'
import TablePackageResto from '../../../components/packageresto/TablePackageResto'
import { useDispatch } from 'react-redux';
import { reduxUpdateTitle } from '../../../features/titleSlice';

const PagePackageResto = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
        reduxUpdateTitle({
            rTitle: "Package Resto",
        })
    );
}, [dispatch]);

  return (
    <div>
      <TablePackageResto />
    </div>
  )
}

export default PagePackageResto