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
import CompanyPage from "./routes/CompanyPage/CompanyPage";
import CompanyDirectoryPage from "./routes/CompanyDirectoryPage/CompanyDirectoryPage";

import MarketExplorerPage from "./routes/marketExplorerPage/marketExplorerPage";

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
                    path: "/city_info/:city/:state", // City information page route
                    element: <CityPage />
                },
                {
                    path: "/companies/:company_name", // Company page route
                    element: <CompanyPage />
                },
                {
                    path: "/companies", // Company page route
                    element: <CompanyDirectoryPage />
                },
                {
                    path: "/market_explorer", // Market Explorer page route
                    element: <MarketExplorerPage />
                }
            ]
        },
    ]);

    return (

        <RouterProvider router={router} />);
}

export default App