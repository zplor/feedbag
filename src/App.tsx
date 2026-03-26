import { memo, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { InitializationSuspense } from "~/components";
import { RoutesList } from "./routes";

const App = memo(() => {
	return (
		<BrowserRouter basename={"/"}>
			<InitializationSuspense>
				<Suspense fallback={null}>
					<Routes>
						{RoutesList?.map?.((route) => (
							<Route
								key={route?.path ?? "*"}
								path={route?.path}
								element={route?.element}
							/>
						))}
					</Routes>
				</Suspense>
			</InitializationSuspense>
		</BrowserRouter>
	);
});

App.displayName = "App";

export default App;
