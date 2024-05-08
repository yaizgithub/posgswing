import { Button, Skeleton, Table } from "antd";
import React from "react";
import { usePostUserMenuData } from "../../hooks/useUserMenuData";
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
import { useMenuAplikasiData } from "../../hooks/useMenuAplikasiData";
import { baseUrl } from "../../config";
import axios from "axios";
import { usePostUserMenuAplikasiData } from "../../hooks/useUserMenuAplikasiData";

const GridMenuAplikasi = () => {
    let grid;

    const { userid } = useSelector((state) => state.auth);
    const { dataSelected } = useSelector((state) => state.mydataselected);

    

    ///HOOKs
    const {mutateAsync: mutatePostUserMenuAplikasiData} =usePostUserMenuAplikasiData();
    const { data, isLoading, isError, error } = useMenuAplikasiData(true);
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

    const onClickSave = async() => {
        // console.log(dataSelected);
        const selectdata = grid.getSelectedRecords();
        // console.log(selectdata);
        selectdata.forEach(async (element) => {
            // console.log(element.title);
            var data = {
                id_user: dataSelected.id,
                child_id: element.child_id,
                parent_id: element.parent_id,
                user_id: userid,
                updator: userid,
            };
            await mutatePostUserMenuAplikasiData(data);
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
						field="parent_name"
						headerText="MENU"
						// textAlign="center"
						width="120"
					/>
					<ColumnDirective
						field="child_name"
						headerText="SUB MENU"
						// textAlign="center"
						width="120"
					/>
				</ColumnsDirective>
				<Inject services={[Search, Toolbar, CommandColumn, Page]} />
			</GridComponent>
			<div className="pt-3 pb-3 float-right">
				<Button type="primary" onClick={onClickSave}>
					Save
				</Button>
			</div>
		</div>
	);
};

export default GridMenuAplikasi;
