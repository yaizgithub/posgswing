import { Button, Skeleton, Table } from "antd";
import React from "react";
import { useGetMenuUserMenuData, usePostUserMenuData } from "../../hooks/useUserMenuData";
import { useSelector } from "react-redux";
import {
    ColumnDirective,
    ColumnsDirective,
    CommandColumn,
    GridComponent,
    Inject,
    Search,
    Toolbar,
    Page,
} from "@syncfusion/ej2-react-grids";
import { useMenusData } from "../../hooks/useMenusData";

const GridMenus = () => {
    let grid;

    const { userid } = useSelector((state) => state.auth);
    const { dataSelected } = useSelector((state) => state.mydataselected);

    

    ///HOOKs
    const {mutateAsync: mutatePostUserMenuData} =usePostUserMenuData();
    const { data, isLoading, isError, error } = useMenusData(true);
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

    ///SYNCFUSION
    const selectionOptions = {
        checkboxMode: "ResetOnRowClick",
    };

    // const rowSelected = () => {
    //     if (grid) {
    //         // console.log(grid.getSelectedRecords()[0]);
    //         const data = grid.getSelectedRecords()[0];
    //         setDataSelected(data);
    //     }
    // };
    ///END SYNCFUSION

    const onClickSave = () => {
        // console.log(dataSelected);
        const selectdata = grid.getSelectedRecords();
        console.log("------");
        console.log(selectdata);
        console.log("------");
        selectdata.forEach(async (element) => {
            // console.log(element.title);
            var data = {
                nim: dataSelected.id,
                label: element.label,
                kunci: element.key,
                icon: element.icon,
                kategori: element.kategori,
                user_id: userid,
                updator: userid,
            };

            await mutatePostUserMenuData(data);
        });
    };    
    return (
        <div>
            <GridComponent
                        ref={(g) => (grid = g)}
                        height="40vh"
                        gridLines="Both"
                        dataSource={data.data}
                        // commandClick={commandClick}
                        // dataBound={dataBound}
                        // rowHeight={"30"}
                        // toolbar={toolbarOptions}
                        // toolbarClick={toolbarClick}
                        // rowSelected={rowSelected}
                        // allowPaging={true}
                        // pageSettings={{ pageSizes: true, pageSize: 10 }}
                        selectionSettings={selectionOptions}
                    >
                        <ColumnsDirective>
                            {/* <ColumnDirective
                        field="id"
                        headerText="ID"
                        // textAlign="center"
                        width="80"
                    /> */}
                            <ColumnDirective type="checkbox" width="50" />
                            <ColumnDirective
                                field="label"
                                headerText="MENU"
                                // textAlign="center"
                                width="120"
                            />
                        </ColumnsDirective>
                        <Inject
                            services={[Search, Toolbar, CommandColumn, Page]}
                        />
                    </GridComponent>
            <div className="pt-3 pb-3 float-right">
                <Button type="primary" onClick={onClickSave}>Save</Button>
            </div>
        </div>
    );
};

export default GridMenus;
