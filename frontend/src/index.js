import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./components/main";
import Home from "./components/home";
import ReferalSystem from "./components/refrel";
import Task from "./components/tasks";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorCom from "./components/common/errorCom";
import Boost from "./components/boost";
import Leaderboard from "./components/leaderboard";
import Notification from "./components/notification";
import Wallet from "./components/wallet";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Loader } from "./components/LoaderContext";
const router = createBrowserRouter([
	{
		path: "/",
		element: <Main />,
		errorElement: <ErrorCom />,

		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/refer",
				element: <ReferalSystem />,
			},
			{
				path: "/leaderboard",
				element: <Leaderboard />,
			},
			{
				path: "/notification",
				element: <Notification />,
			},

			{
				path: "/tasks",
				element: <Task />,
			},
			{
				path: "/boost",
				element: <Boost />,
			},
			{
				path: "/wallet",
				element: <Wallet />,
			},
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<React.StrictMode>
		<TonConnectUIProvider manifestUrl='https://kvants.vercel.app/manifest.json'>
			<Loader>
				<RouterProvider router={router}></RouterProvider>
			</Loader>
		</TonConnectUIProvider>
	</React.StrictMode>
);
