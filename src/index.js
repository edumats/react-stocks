import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css';
import Root from "./routes/root";
import ErrorPage from './error-page';
import TransactionForm from './routes/buy';
import Portfolio from './routes/portfolio';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Portfolio />
            },
            {
                path: "/buy",
                element: <TransactionForm mode="buy"/>
            },
            {
                path: "/sell",
                element: <TransactionForm mode="sell"/>
            }
        ]
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)