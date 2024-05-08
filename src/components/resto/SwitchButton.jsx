import { Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { useUpdateStatusMejaData } from '../../hooks/useMejaData';

const SwitchButton = (props) => {

    const [isOpen, setIsOpen] = useState(false);

    ///HOOKs
    const {mutateAsync: mutateUpdateStatusMeja} =useUpdateStatusMejaData();

    useEffect(() => {
        setIsOpen(props.status === "0" ? true : false);
    }, [props.status])





    const onChangeSwitch = async(v) => {
        setIsOpen(v);

        ///ubah status meja di tbl_meja
        let a = {
            status: v ? "0" : "1",
        }
        await mutateUpdateStatusMeja([props.id, a]);
    }
    return (
        <div>
            <Switch checkedChildren="Available" unCheckedChildren="In-used" checked={isOpen} onChange={onChangeSwitch} />
        </div>
    )
}

export default SwitchButton