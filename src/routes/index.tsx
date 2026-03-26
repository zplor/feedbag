import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { HomePage, WorkspacePage } from "~/pages";

export const RoutesList: RouteObject[] = [
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/app",
		element: <WorkspacePage />,
	},
	{
		path: "*",
		element: <Navigate to="/" replace />,
	},
];
