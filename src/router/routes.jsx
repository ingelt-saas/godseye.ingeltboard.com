import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PanelLayout from "../layouts/PanelLayout";
import Home from "../pages/Home";
import Modules from "../pages/Modules";
import Library from "../pages/Library";

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
                    element: <Modules />
                },
                {
                    path: '/centralized-library',
                    element: <Library />
                },
            ]
        }
    ]);

    return (
        <RouterProvider router={router}></RouterProvider>
    );
}

export default Routes;
