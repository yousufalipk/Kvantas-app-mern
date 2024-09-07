import React, { createContext, useState, useContext } from "react";

const TaskContext = createContext();

export const Loader = ({ children }) => {
	// Using an object to store the state of loaders for individual tasks
	const [isVerify, setIsVerify] = useState({});
	const [isButtonType, setButtonType] = useState({});

	const setLoaderState = (taskId, isLoading) => {
		setIsVerify((prev) => ({ ...prev, [taskId]: isLoading }));
	};

	const setButtonTypeState = (taskId, type) => {
		setButtonType((prev) => ({ ...prev, [taskId]: type }));
	};

	return (
		<TaskContext.Provider
			value={{
				isVerify,
				setLoaderState,
				isButtonType,
				setButtonTypeState,
			}}>
			{children}
		</TaskContext.Provider>
	);
};

export const useLoader = () => {
	return useContext(TaskContext);
};
