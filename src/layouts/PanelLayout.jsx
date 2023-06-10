import { Outlet } from "react-router-dom";
import SideBar from "../components/shared/Sidebar";

const PanelLayout = () => {
    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div
                className={`sidebar border-r border-[#DCDEE1] overflow-y-auto no-scrollbar relative`}
            >
                <SideBar />
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-50 py-2 lg:py-6">
                <Outlet />
            </div>
        </div>
    );
}

export default PanelLayout;
