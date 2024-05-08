import React from 'react'
import { useSelector } from 'react-redux';
import { useWaktuServerData } from '../../../hooks/useWaktuServer';
import { useOneRegistrasiData } from '../../../hooks/registrasi/useRegistrasiData';
import { Card, Flex, Skeleton } from 'antd';
import dayjs from "dayjs";

const PageInfoPlayer = () => {
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    ///HOOKs
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const {
        data: dataOneRegistrasi,
        isLoading,
        isError,
        error,
    } = useOneRegistrasiData(matrixSelected.registrasi_id, true);

    if (isLoading) {
        return (
            <div>
                <Skeleton active />
            </div>
        );
    }

    if (isError) {
        console.log(error.message);
        return (
            <div>
                <div className="text-red-600 mb-2">{error.message}</div>
                <Skeleton active />
            </div>
        );
    }

  return (
    <div>
        <Card
                        title="Player Info"
                        size="small"
                        // style={{ width: "450px" }}
                        styles={{
                            header: { backgroundColor: "#DAE8FE" },
                            body: { backgroundColor: "#EFF4FD" },
                        }}
                    >
                        <div className="flex justify-start gap-7">
                            <div className="w-52">
                                <Flex justify="space-between">
                                    <div>Date</div>
                                    <div>
                                        {dayjs(dataWaktuServer?.waktuserver).format("DD/MM/YYYY")}
                                    </div>
                                </Flex>
                                <Flex justify="space-between">
                                    <div>Bay</div>
                                    <div>{dataOneRegistrasi?.data[0].bay ?? "-"}</div>
                                </Flex>
                                <Flex justify="space-between">
                                    <div>Table</div>
                                    <div>{dataOneRegistrasi?.data[0].no_meja ?? "-"}</div>
                                </Flex>
                                <Flex justify="space-between">
                                    <div>Ref. No</div>
                                    <div>{dataOneRegistrasi?.data[0].id}</div>
                                </Flex>
                                <Flex justify="space-between">
                                    <div>Player</div>
                                    <div>
                                        {dataOneRegistrasi?.data[0].nama ?? "-"}
                                    </div>
                                </Flex>
                                <Flex justify="space-between">
                                    <div>Handphone</div>
                                    <div>{dataOneRegistrasi?.data[0].no_hp ?? "-"}</div>
                                </Flex>
                            </div>

                           
                        </div>
                    </Card>
    </div>
  )
}

export default PageInfoPlayer