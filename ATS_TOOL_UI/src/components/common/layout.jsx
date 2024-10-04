import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";

const Layout = ({children}) => {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div className="flex">
                <Sidebar />
                {children}
            </div>
        </div>
    )
}

export default Layout;
