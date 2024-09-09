import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "../../index.css";  // Ensure that you import your CSS file
import { AnimatePresence } from "framer-motion";
import { UserProvider } from "../../context";
import { Toaster } from "sonner";
import { PiCheckCircleFill } from "react-icons/pi";

const Main = () => {
	useEffect(() => {
		const setAppHeight = () => {
			document.documentElement.style.setProperty(
				"--app-height",
				`${window.innerHeight}px`
			);
		};

		setAppHeight();

		window.addEventListener("resize", setAppHeight);

		return () => window.removeEventListener("resize", setAppHeight);
	}, []);

	useEffect(() => {
		const handleContextMenu = (event) => event.preventDefault();
		const handleKeyDown = (event) => {
			if (
				(event.ctrlKey && (event.key === "u" || event.key === "s")) ||
				(event.ctrlKey && event.shiftKey && event.key === "i")
			) {
				event.preventDefault();
			}
		};

		document.addEventListener("contextmenu", handleContextMenu);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="main-content">
			<UserProvider>
				<AnimatePresence mode="wait">
					<Outlet />
					<Toaster
						position="top"
						icons={{
							success: <PiCheckCircleFill className="text-green w-5 h-5" />,
						}}
					/>
				</AnimatePresence>
			</UserProvider>
		</div>
	);
};

export default Main;
