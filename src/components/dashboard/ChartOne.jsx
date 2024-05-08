import React from 'react'
import { Category, ChartComponent, DataLabel, Inject, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Tooltip } from "@syncfusion/ej2-react-charts";
import { useGetChartDrivingData } from '../../hooks/registrasi/useRegistrasiData';
import { Skeleton } from 'antd'

const salesData = [
    {month:'Jan', sales:35}, {month:'Feb', sales:28},
    {month:'Mar', sales:34}, {month:'Apr', sales:32},
    {month:'May', sales:40}, {month:'Jun', sales:32},
    {month:'Jul', sales:35}, {month:'Aug', sales:55},
    {month:'Sap', sales:38}, {month:'Oct', sales:30},
    {month:'Nov', sales:25}, {month:'Des', sales:32},
]

const ChartOne = () => {

  ///HOOKs
  const {data: dataChartDriving, isLoading, isError, error}= useGetChartDrivingData(true);  

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

  // if (dataChartDriving) {
  //   console.log(dataChartDriving?.data);
  // }



  return (
    <div>
      <div>
        <ChartComponent title="Dumming Analysis" primaryXAxis={{valueType:"Category", title:"Month"}}
        primaryYAxis={{title:"Sales"}} legendSettings={{visible:true}} tooltip={{enable:true}}>
            <Inject services={[LineSeries, Category, Legend, DataLabel, Tooltip]}></Inject>
            <SeriesCollectionDirective>
                <SeriesDirective type='Line' dataSource={salesData} 
                xName='month' yName='sales' name='Sales' marker={{dataLabel:{visible:true}, visible:true}}></SeriesDirective>
            </SeriesCollectionDirective>
        </ChartComponent>
      </div>
      <div>
        <ChartComponent title="Driving Sales Analysis" primaryXAxis={{valueType:"Category", title:"Month"}}
        primaryYAxis={{title:"Sales"}} legendSettings={{visible:true}} tooltip={{enable:true}}>
            <Inject services={[LineSeries, Category, Legend, DataLabel, Tooltip]}></Inject>
            <SeriesCollectionDirective>
                <SeriesDirective type='Line' dataSource={dataChartDriving?.data} 
                xName='month' yName='sales' name='Sales' marker={{dataLabel:{visible:true}, visible:true}}></SeriesDirective>
            </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </div>
  )
}

export default ChartOne