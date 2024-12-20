import React from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import { DataProvider } from "../Context";

const Layout = ({ userData, children }) => {
    return (
        <div>
            <DataProvider>
                <div>
                    <Header userInfo={userData} />
                </div>
                <div className="flex">
                    <BrowserRouter>
                        <Sidebar />
                        {children}
                    </BrowserRouter>
                </div>
            </DataProvider>
        </div>
    )
}

export default Layout;
