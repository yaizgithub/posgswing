import { Card, Radio } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOnePackageDriving } from "../../features/packagedriving/onepackagedrivingSlice";
import { usePackageDrivingData } from "../../hooks/usePackageDrivingData";

const ListPaket = () => {
    const dispatch = useDispatch();
    const onePackageDrivingData = useSelector((state) => state.onepackagedriving);

    ///HOOks
    const { data: dataPackageDriving } = usePackageDrivingData(true);

    useEffect(() => {
        console.log(onePackageDrivingData);
    }, [onePackageDrivingData]);

    const onChangeRadio = (e) => {
        // console.log(e.target.value);
        dispatch(getOnePackageDriving(e.target.value));
    };

    return (
        <div>
            <Radio.Group
                onChange={onChangeRadio}
                buttonStyle="solid"
                defaultValue={""}                                
            >
                <div className="flex flex-wrap justify-center items-center gap-3">
                    {dataPackageDriving?.data.map((e, key) => {
                        return (
                            <div key={key} >                                
                                    <Radio.Button style={{height:"150px"}} value={e.id}>
                                        <Card title={e.name} size="small">
                                            {e.hrg_jual.toLocaleString("id")}
                                        </Card>
                                    </Radio.Button>
                                
                            </div>
                        );
                    })}
                </div>
            </Radio.Group>
        </div>
    );
};

export default ListPaket;
