import ReactDOM from "react-dom/client";
import App from "./App";
import i18n from "./i18n";
import "./styles.css";

// Initialize i18n
void i18n.init();

ReactDOM.createRoot(document.getElementById("app")!).render(
	// <React.StrictMode>
	<App />,
	// </React.StrictMode>
);
