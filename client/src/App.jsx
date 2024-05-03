// import "./layout.scss"
import HomePage from "./routes/homePage/homePage";
import ListPage from "./routes/listPage/listPage";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Layout from "./routes/layout/layout"
import SinglePage from "./routes/singlePage/singlePage";
import GeneralCityPage from "./routes/generalCityPage/generalCityPage";

import CityPage from "./routes/CityPage/CityPage";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/", // Home page route
                    element: <HomePage />
                },
                {
                    path: "/list", // List page route
                    element: <ListPage />
                },
                {
                    path: "/:id", // Single page route
                    element: <SinglePage />
                },
                {
                    path: "/cities", // General city page route
                    element: <GeneralCityPage />
                },
                {
                    path: "/city_info", // City information page route
                    element: <CityPage />
                }

            ]
        },
    ]);

    return (

        <RouterProvider router={router} />);
}

export default App