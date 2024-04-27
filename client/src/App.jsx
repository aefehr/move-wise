// import "./layout.scss"
import HomePage from "./routes/homePage/homePage";
import ListPage from "./routes/listPage/listPage";
import{
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Layout from "./routes/layout/layout"
import SinglePage from "./routes/singlePage/singlePage";
function App() {
    const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children:[
            {
                path:"/",
                element:<HomePage/>
            },
            {
                path:"/list",
                element:<ListPage/>
            },
            {
                path:"/:id",
                element:<SinglePage/>
            },
            
        ]
    },
    {
        path: "/list",
        element: <ListPage/>,
    },
    ]);

  return (

  <RouterProvider router={router} />  );
}

export default App