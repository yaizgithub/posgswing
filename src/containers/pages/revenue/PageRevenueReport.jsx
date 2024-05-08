import React, { useEffect } from "react";
import { Viewer } from "@grapecity/activereports-react";
import "@grapecity/activereports/pdfexport";
import "@grapecity/activereports/htmlexport";
import "@grapecity/activereports/tabulardataexport";
import { FontStore } from "@grapecity/activereports/core";
import { baseUrl } from "../../../config";
import "./style.css";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const exportsSettings = {
  pdf: {
    title: "ActiveReportsJS Sample",
    author: "GrapeCity",
    subject: "Web Reporting",
    keywords: "reporting, sample",
    userPassword: "pwd",
    ownerPassword: "ownerPwd",
    printing: "none",
    copying: false,
    modifying: false,
    annotating: false,
    contentAccessibility: false,
    documentAssembly: false,
    pdfVersion: "1.7",
    autoPrint: true,
    filename: "Account.pdf",
  },
  html: {
    title: "ActiveReportsJS Sample",
    filename: "ActiveReportsJS-Sample.html",
    autoPrint: true,
    multiPage: true,
    embedImages: "external",
    outputType: "html",
  },
};

const PageRevenueReport = (props) => {
  const viewerRef = React.useRef();
  const location = useLocation();
  const date = location.state.date;

  const { userid } = useSelector((state) => state.auth);

  async function loadData() {
    const headers = new Headers();

    const dataRequest = new Request(
      `${baseUrl}/revenue/rpt-revenue?date=${date}`,
      {
        headers: headers,
      }
    );

    const response = await fetch(dataRequest);
    const data = await response.json();
    return data;
  }

  const loadReport = async () => {
    // load report definition from the file
    const reportResponse = await fetch("revenue_report.rdlx-json");
    const report = await reportResponse.json();
    return report;
  };

  useEffect(() => {
    async function openReport() {
      const data = await loadData();
      const report = await loadReport();
      report.DataSources[0].ConnectionProperties.ConnectString =
        "jsondata=" + JSON.stringify(data);
      viewerRef.current.Viewer.open(report);
    }
    openReport();
    console.log(props.date);
  }, [location]);

  return (
    <div id="viewer-host">
      <Viewer
        ref={viewerRef}
        exportsSettings={exportsSettings}
        sidebarVisible={true}
        toolbarVisible={true}
        zoom="100%"
        fullscreen={true}
      />
    </div>
  );
};

FontStore.registerFonts("/activereportsjs/demos/resource/fontsConfig.json");
export default PageRevenueReport;
