import React, { useEffect } from 'react'
import TablePackageDriving from '../../../components/packagedriving/TablePackageDriving'
import { useDispatch } from 'react-redux';
import { reduxUpdateTitle } from '../../../features/titleSlice';

const PagePackageDriving = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
        reduxUpdateTitle({
            rTitle: "Package Driving",
        })
    );
}, [dispatch]);

  return (
    <div>
      <TablePackageDriving />
    </div>
  )
}

export default PagePackageDriving