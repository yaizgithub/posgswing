import React from "react";
import {
    ColumnDirective,
    ColumnsDirective,
    CommandColumn,
    GridComponent,
    Inject,
    Search,
    Toolbar,
    Page,
    Filter,
    Resize,
} from "@syncfusion/ej2-react-grids";
// import {TreeGridComponent, ColumnsDirective, ColumnDirective, Inject, Page} from '@syncfusion/ej2-react-treegrid'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getPoByTanggal,
    pobytanggalSelectors,
} from "../../features/po/pobytanggalSlice";
import { getPoDetail } from "../../features/po/podetailSlice";
import { Card, Skeleton } from "antd";

const GridMasterPo = (props) => {
    let grid;

    const dispatch = useDispatch();

    const data = useSelector((state) => state.pobytanggal);

    const [dataSelected, setDataSelected] = useState();

    /// SYNCFUCION
    const toolbarOptions = [
        // {
        //     text: "Add Buggy",
        //     // tooltipText: "Add Category",
        //     prefixIcon: "e-add",
        //     id: "addButton",
        // },
        "Search",
    ];

    const toolbarClick = (args) => {
        if (grid) {
            if (args.item.id === "addButton") {
                // console.log("tombol add");
                // props.openInputModal(true);
            }
        }
    };

    const rowSelected = () => {
        if (grid) {
            // console.log(grid.getSelectedRecords()[0].id);
            const dataRow = grid.getSelectedRecords()[0];
            const selectedRowIndexes = grid.getSelectedRowIndexes()[0];
            setDataSelected(dataRow);
            dispatch(getPoDetail(selectedRowIndexes));
        }
    };

    const filterOptions = {
        ignoreAccent: true,
        type: "CheckBox",
    };
    /// END SYNCFUCION

    return (
        <div>
            <Card title="Master PO" size="small" className="bg-[#D0E7D2]">
                {data.loading && (
                    <div>
                        <Skeleton active />
                    </div>
                )}
                {!data.loading && data.error ? (
                    <div>Error: {data.error}</div>
                ) : null}
                {!data.loading && data.dataPO.length ? (
                    // <ul>
                    //     {data.dataPO.map((e) => (
                    //         <li>{e.id}</li>
                    //     ))}
                    // </ul>
                    <GridComponent
                        ref={(g) => (grid = g)}
                        height="30vh"
                        gridLines="Both"
                        dataSource={data.dataPO}
                        // rowHeight={"30"}
                        toolbar={toolbarOptions}
                        toolbarClick={toolbarClick}
                        rowSelected={rowSelected}
                        allowPaging={true}
                        allowFiltering={true}
                        filterSettings={filterOptions}
                        allowResizing={true}
                        autoFit={true}
                        pageSettings={{ pageSizes: true, pageSize: 10 }}
                    >
                        <Inject
                            services={[
                                Search,
                                Toolbar,
                                CommandColumn,
                                Page,
                                Filter,
                                Resize,
                            ]}
                        />
                        <ColumnsDirective>
                            <ColumnDirective
                                field="date"
                                headerText="DATE"
                                // textAlign="center"
                                // width="500"
                                // minWidth={300}
                            />
                            <ColumnDirective
                                field="id"
                                // valueAccessor={rowNumerCal}
                                // template={gridTemplate}
                                headerText="ID"
                                // textAlign="center"
                                width="150"
                            />

                            <ColumnDirective
                                field="company"
                                headerText="COMPANY"
                                // textAlign="center"
                                // width="120"
                            />
                            <ColumnDirective
                                field="department"
                                headerText="DEPARTEMENT"
                                // textAlign="center"
                                // width="500"
                                // minWidth={300}
                            />
                            <ColumnDirective
                                field="title"
                                headerText="TITLE"
                                // textAlign="center"
                                // width="500"
                                // minWidth={300}
                            />

                            <ColumnDirective
                                field="description"
                                headerText="DESCRIPTION"
                                // textAlign="center"
                                // width="500"
                                // minWidth={300}
                            />
                            <ColumnDirective
                                field="total"
                                headerText="TOTAL"
                                textAlign="Right"
                                type="Number"
                                format="N"
                                // textAlign="center"
                                // width="500"
                                // minWidth={300}
                            />
                            <ColumnDirective
                                field="ppn"
                                headerText="PPN"
                                textAlign="Right"
                                // type="Number"
                                // format="N2"
                                // textAlign="center"
                                // width="500"
                                // minWidth={300}
                            />
                            <ColumnDirective
                                field="pph"
                                headerText="PPH"
                                textAlign="Right"
                                // type="Number"
                                // format="N2"
                                // textAlign="center"
                                // width="500"
                                // minWidth={300}
                            />

                            <ColumnDirective
                                field="user_id"
                                headerText="User"
                                // textAlign="center"
                                // width="200"
                                // minWidth={200}
                            />
                        </ColumnsDirective>
                    </GridComponent>
                ) : null}
            </Card>
        </div>
    );
};

export default GridMasterPo;
