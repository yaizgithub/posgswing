import { Card, Col, Row, Skeleton, Statistic } from 'antd'
import React from 'react'
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useGetCountPlayerData } from '../../hooks/registrasi/useRegistrasiData';
import { FaGolfBallTee } from "react-icons/fa6";

const StatisticOne = () => {


    ///HOOKs
    const {data: dataCountPlayer, isLoading, isError, error} = useGetCountPlayerData(true);

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
        
        <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={false} style={{backgroundColor:"#E5E1DA"}}>
                        <Statistic
                            title="Moorning"
                            value={dataCountPlayer?.data[0]?.Player}
                            precision={0}
                            valueStyle={{
                                color: "#3f8600",
                            }}
                            prefix={<FaGolfBallTee />}
                            suffix="Player"
                            
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={false} style={{backgroundColor:"#E5E1DA"}}>
                        <Statistic
                            title="Afternoon"
                            value={dataCountPlayer?.data[1].Player}
                            precision={0}
                            valueStyle={{
                                color: "#cf1322",
                            }}
                            prefix={<FaGolfBallTee />}
                            suffix="Player"
                        />
                    </Card>
                </Col>
            </Row>
    </div>
  )
}

export default StatisticOne