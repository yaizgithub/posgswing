import React, { useEffect } from "react";
import TableUserRegistrasi from "../../../components/auth/TableUserRegistrasi";
import TableUserMenu from "../../../components/usermenu/TableUserMenu";
import { Card } from "antd";
import { useSelector } from "react-redux";
import TableOneUserMenuAplikasi from "../../../components/usermenuaplikasi/TableOneUserMenuAplikasi";

const Registrasi = () => {
    const { dataSelected } = useSelector((state) => state.mydataselected);

    return (
        <div>
            <div className="mb-5 flex flex-wrap justify-between items-start gap-7">
                <div className="flex-1">
                    <Card
                        title="Registrasi User"
                        size="small"
                        styles={{ header:{backgroundColor: "#92C7CF"} }}
                    >
                        <TableUserRegistrasi />
                    </Card>
                </div>
                <div className="flex-1">
                    <Card
                        title={`User Menu - ${dataSelected.username}`}
                        size="small"
                        styles={{ header:{backgroundColor: "#92C7CF"} }}
                    >
                        {/* <TableUserMenu /> */}
                        <TableOneUserMenuAplikasi />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Registrasi;
