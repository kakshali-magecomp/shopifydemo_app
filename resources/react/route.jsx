import { Route, Routes } from "react-router-dom";
import React from "react";
import IndexPage from "./pages/edit";
import ListPage from "./pages/list";
import EditPage from "./pages/edit";
import CreatePage from "./pages/create";
import OrderDashboard from "./pages/OrderDashboard";
import { IndexTable } from "@shopify/polaris";

	const AppRoute = () => {
	    return (
		 <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/edit" element={<EditPage />} />
			<Route path="/create" element={<CreatePage />} />
			<Route path="/OrderDashboard" element={<OrderDashboard />} />

        </Routes>
	    );
	};

	export default AppRoute;