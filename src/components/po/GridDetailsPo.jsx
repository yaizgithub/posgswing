import React, { useEffect } from "react";
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
import {
    getPoDetail,
    podetailSelectors,
} from "../../features/po/podetailSlice";
import { Card, Skeleton } from "antd";

const GridDetailsPo = (props) => {
    let grid;

    const dispatch = useDispatch();

    const [dataSelected, setDataSelected] = useState();

    const data = useSelector((state) => state.podetail);

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
        }
    };

    const filterOptions = {
        ignoreAccent: true,
        type: "CheckBox",
    };
    /// END SYNCFUCION

    return (
        <div>
            <Card title="Detail PO" size="small" className="bg-[#D0E7D2]">
                {data.loading && (
                    <div>
                        <Skeleton active />
                    </div>
                )}
                {!data.loading && data.error ? (
                    <div>Error: {data.error}</div>
                ) : null}
                {!data.loading && data.dataPoDetails.length ? (
                    <GridComponent
                        ref={(g) => (grid = g)}
                        height="30vh"
                        gridLines="Both"
                        dataSource={data.dataPoDetails}
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
                                Filter,
                                Toolbar,
                                CommandColumn,
                                Page,
                                Resize,
                            ]}
                        />
                        <ColumnsDirective>
                            <ColumnDirective
                                field="id"
                                // valueAccessor={rowNumerCal}
                                headerText="ID"
                                // textAlign="center"
                                // width="150"
                            />

                            <ColumnDirective
                                field="items_id"
                                headerText="ITEMS"
                                // textAlign="center"
                                // width="150"
                            />
                            <ColumnDirective
                                field="qty"
                                headerText="QTY"
                                textAlign="Right"
                                type="Number"
                                format="N"
                                // width="500"
                                // minWidth={300}
                            />
                            <ColumnDirective
                                field="price"
                                headerText="PRICE"
                                textAlign="Right"
                                type="Number"
                                format="N"
                                // width="500"
                                // minWidth={300}
                            />
                        </ColumnsDirective>
                    </GridComponent>
                ) : null}
            </Card>
        </div>
    );
};

export default GridDetailsPo;
