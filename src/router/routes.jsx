import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PanelLayout from "../layouts/PanelLayout";
import Home from "../pages/Home";
import Modules from "../pages/Modules";
import Library from "../pages/Library";
import AddModule from "../pages/AddModule";
import Institute from "../pages/Institute";
import { useContext } from "react";
import { AdminContext } from "../contexts";
import LoginLayout from "../layouts/LoginLayout";
import Loader from '../components/shared/Loader';
import Blogs from "../pages/Blogs";
import Students from "../pages/Students";
import LoanQuery from "../pages/LoanQuery";
import UniversitiesQuery from "../pages/UniversitiesQuery";
import VisaQuery from "../pages/VisaQuery";
import Discussions from "../pages/Discussions";
import Universities from "../pages/Universities";

const Routes = () => {

    const { loading, inGelt } = useContext(AdminContext);

    const router = inGelt ? createBrowserRouter([
        {
            path: '/',
            element: <PanelLayout />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: '/modules',
                    element: <Modules />,
                },
                {
                    path: '/modules/add',
                    element: <AddModule />
                },
                {
                    path: '/centralized-library',
                    element: <Library />
                },
                {
                    path: '/university',
                    element: <Universities />
                },
                {
                    path: '/institute',
                    element: <Institute />
                },
                {
                    path: '/blogs',
                    element: <Blogs />
                },
                {
                    path: '/discussion',
                    element: <Discussions />
                },
                {
                    path: '/students',
                    element: <Students />
                },
                {
                    path: '/loan-query',
                    element: <LoanQuery />
                },
                {
                    path: '/visa-query',
                    element: <VisaQuery />
                },
            ]
        }
    ]) : createBrowserRouter([
        {
            path: '*',
            element: <LoginLayout />,
        }
    ]);

    return (
        loading ? <Loader /> : <RouterProvider router={router}></RouterProvider>
    );
}

export default Routes;
