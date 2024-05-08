import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import "./index.css";
import App from "./App";

import { store } from "./app/store";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";


import { registerLicense } from "@syncfusion/ej2-base";
import { Core } from "@grapecity/activereports";
Core.setLicenseKey(
    "BOARD4ALL,wifier,B4C850C346AF477#B0iiWu3Waz9WZ4hXRgAicldXZpZFdy3GclJFIv5mapdlI0IiTisHL3JyS7gDSiojIDJCLi86bpNnblRHeFBCI73mUpRHb55EIv5mapdlI0IiTisHL3JCNGZDRiojIDJCLi86bpNnblRHeFBCIQFETPBCIv5mapdlI0IiTisHL3JyMDBjQiojIDJCLiUmcvNEIv5mapdlI0IiTisHL3JSV8cTQiojIDJCLi86bpNnblRHeFBCI4JXYoNEbhl6YuFmbpZEIv5mapdlI0IiTisHL3JSSGljQiojIDJCLiITMuYHITpEIkFWZyB7UiojIOJyes4nIZRVV9IiOiMkIsISM6ByUKN7dllmVhRXYEJiOi8kI1xSfi24QRpkI0IyQiwiIzYFITpEdy3GclJVZ6lGdjFkI0IiTisHL3JCTBF5UiojIDJCLiUTMuYHITpEIkFWZyB7UiojIOJyebpjIkJHUiwSZzxWYmpjIsZXRiwSflVnc4pjIyNHZisnOiwmbBJCLiEDMwAjMxASMwEDMyIDMyIiOiQncDJCLioXai9CbsFGNkJXYvJGQyVWaml6diojIh94QiwiI7cDNGFkN4MzQwUDODRjQiojIklkI1pjIEJye&QfiADNyQUM6cjMiojIIJCLi4TPnZUOQ3kMqFmeJ9WbYVkb7BVTtZEM6wWY5QjWxITZzNnTGtiVUp5arlje4IlMo3kcBhnVCdXVQJ5MjtmSClENXlXVjZVeQdFOJBjWHFUUyUVYu5kNwMTaxNHUplnbjNlctljN6t6coF6bEp6U8A5YJtSa62WRSR4SJRGem9UUvQ6TYJjVCRXbWdEbHxERphlSDpkQGZGZkNnNMhmUycjc6VHMTFGOItWV4kmMOpXWspXNYlzZzMFNxt4b5clVpFXdUJmdFV6MmhkQz3kQBlEZ6UjZHJ7RZF6QGhVYkNVW9E7QPB7MroHVk5WQ0BFbzN5ZYJVUGZjePllS8EWSwQ5VFp7SxRzKvtydEZFRyhEbyJTdhp7U43Sb63ST0pFTaFnNsdWQ5Q5QEZDN4BHZ0RGeyB7bS56YoFEcwQzNKJGb5AVcLp7dj3UdO3Sbz5mNPx6S5hzMvZkWiojITJCL35VfiIVV84kI0IyQiwiIvJHcgMjVgIXZ7VWaWZGZQN6RiojIOJyes4nIJBjMSJiOiMkIsIibvl6cuVGd8VEIgQXZlh6U8VGbGBybtpWaXJiOi8kI1xSfiUTSOFlI0qyii"
);

// Registering Syncfusion license key
registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWX5cdnRUQmNYWEZ/XUM="
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#062E6F",
                        // colorPrimary: "#1C3066",
                        // colorPrimary: "#66604E",
                    },
                    components: {
                        Segmented: {
                            itemSelectedBg: "#B6C0CF",
                            
                        },
                       
                      },
                }}
            >
                <App />
            </ConfigProvider>
        </Provider>
    </BrowserRouter>
);
