import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PanelLayout from "../layouts/PanelLayout";
import Home from "../pages/Home";
import Modules from "../pages/Modules";
import Library from "../pages/Library";
import AddModule from "../pages/AddModule";
import Institute from "../pages/Institute";
import ShortlistUniversity from "../pages/ShortlistUniversity";

const Routes = () => {

    const router = createBrowserRouter([
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
                    path: '/shortlist-university',
                    element: <ShortlistUniversity />
                },
                {
                    path: '/institute',
                    element: <Institute />
                },
            ]
        }
    ]);

    return (
        <RouterProvider router={router}></RouterProvider>
    );
}

export default Routes;
