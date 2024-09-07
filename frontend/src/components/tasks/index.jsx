import { useEffect, useState } from "react";
import { useUser } from "../../context";
import kvai from "../../assets/kvai.png";
import Notificationleft from "../../assets/dailyNews2.png";
import NotificationRight from "../../assets/dailyNews3.png";
import {
	award,
	comment,
	completed_img,
	dailyreward,
	incomplete_img,
	kvaiCoin,
	KvantCoinBlack,
	like,
	youtube,
	x,
	insta,
	search,
} from "../../assets";

import { notify, notifyError } from "../../utils/notify";
import { Toaster } from "sonner";
import { PiCheckCircleFill } from "react-icons/pi";
import TaskItem from "./taskItem";
import Footer from "../common/footer";
import TaskPageDialog from "./dilog";
import AnnouncementHandle from "./announcementHandle";
import { useLoader } from "../LoaderContext";
import {
	doc,
	getDoc,
	addDoc,
	serverTimestamp,
	updateDoc,
} from "@firebase/firestore";
import { db } from "../../config/firebase";

const Task = () => {
	const {
		id,
		balance,
		sendUserData,
		setBalance,
		task,
		claimed,
		setTask,
		dailyTaskList,
		setDailyTaskList,
		selection,
		setClaimed,
		value,
		setButton,
		socialTask,
		dailyTask,
		updateTwitterName,
		twitterUserName,
		announcement,
		updateAnnouncementLink,
		fetchAnnouncementReward,
	} = useUser();
	const { isVerify, setLoaderState, isButtonType, setButtonTypeState } =
		useLoader();
	const [isReward, setReward] = useState(false);
	const [taskId, setTaskId] = useState("");

	const [isTwitter, setIsTwitter] = useState(false);
	// const [isMoreLink, setIsMoreLink] = useState(false);
	const [isLinkVerify, setIsLinkVerify] = useState(false);
	const check24hour = (date) => {
		const now = new Date();
		const lastClaimedDate = date.toDate();
		if (!lastClaimedDate) {
			return true;
		}

		// const oneDay = 24 * 60 * 60 * 1000;
		const oneDay = 60 * 1000;
		return now - lastClaimedDate >= oneDay;
	};

	const handle = async (value) => {
		try {
			const userRef = doc(db, "telegramUsers", id.toString());
			// const userRef = doc(db, "telegramUsers", "7326264229");
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				let data = userDoc.data();
				let { date, claimed = [] } = data?.daily_claimed;
				const newBalance = data?.balance + value?.reward;

				if (date !== "") {
					setButton(true);
					if (check24hour(date) == false) {
						notifyError("You have already claimed today's reward.");
						return;
					} else {
						await updateDoc(userRef, {
							balance: newBalance,
							daily_claimed: {
								claimed: [...claimed, value?.day],
								day: Number(value.day),
								reward: value.reward,
								date: serverTimestamp(),
							},
						});

						console.log(claimed, "=", value.day);

						if (value.day === 6) {
							setClaimed([]);
						} else {
							setClaimed([...claimed, value?.day]);
						}

						notify("You have successfully claimed today's reward.");
						setButton(false);
						setReward(false);
						sendUserData();
						selection();
					}
				} else {
					await updateDoc(userRef, {
						balance: newBalance,
						daily_claimed: {
							claimed: [...claimed, value?.day],
							day: Number(value.day),
							reward: value.reward,
							date: serverTimestamp(),
						},
					});
					console.log(claimed, "-", value.day);
					if (value.day === 6) {
						setClaimed([]);
					} else {
						setClaimed([...claimed, value?.day]);
					}

					notify("You have successfully claimed today's reward.");
					setButton(false);
					setReward(false);
					sendUserData();
					selection();
				}
			}
		} catch (error) {
			console.error("Error claiming referral reward:", error);
		}
	};

	const verifyTelegramMembership = async (userId) => {
		try {
			const response = await fetch(
				`https://api.telegram.org/bot7318708895:AAEX__GIGjueSNYnBi5f4iwgX1rmdE6KzzI/getChatMember?chat_id=-1002168233017&user_id=${Number(
					userId.toString()
				)}`
			);

			const data = await response.json();

			if (
				data.ok &&
				(data.result.status === "member" ||
					data.result.status === "administrator" ||
					data.result.status === "creator")
			) {
				return true;
			} else {
				throw new Error("Not a member of the Telegram channel.");
			}
		} catch (error) {
			console.error("Error verifying Telegram status:", error);
			throw error;
		}
	};

	const onClickLink = async (amount, task_id, image) => {
		setButtonTypeState(task_id, task_id);
		setLoaderState(task_id, true);
		console.log(task_id);
		console.log(amount);

		try {
			// Telegram-specific verification
			if (image === "telegram") {
				const isMember = await verifyTelegramMembership(id);

				if (!isMember) {
					setTimeout(() => {
						notifyError(
							"Please join the Telegram channel first before you can claim this task bonus."
						);
						setButtonTypeState(task_id, "");
						setLoaderState(task_id, false);
					}, 2000);
					return; // Exit if not a member
				}
			}

			// Handle reward claiming
			setTimeout(async () => {
				const userRef = doc(db, "telegramUsers", id.toString());
				const userDoc = await getDoc(userRef);

				if (userDoc.exists()) {
					const { balance, task_lists = [] } = userDoc.data();
					const newBalance = balance + Number(amount);

					// Ensure the task has not been claimed yet
					if (!task_lists.includes(task_id)) {
						await updateDoc(userRef, {
							balance: newBalance,
							task_lists: [...task_lists, task_id],
						});
						setTask([...task_lists, task_id]);

						setTimeout(() => {
							setButtonTypeState(task_id, "");
							setLoaderState(task_id, false);
							setBalance(newBalance);
							notify(`Reward has been claimed`);
						}, 20000);
					} else {
						notifyError("This task has already been claimed.");
						setButtonTypeState(task_id, "");
						setLoaderState(task_id, false);
					}
				}
			}, 1000);
		} catch (error) {
			setTimeout(() => {
				notifyError("An error occurred during the verification process.");
				setButtonTypeState(task_id, "");
				setLoaderState(task_id, false);
			}, 2000);
		}
	};

	// const onClickLink = async (amount, task_id) => {
	// 	setButtonTypeState(task_id, task_id);
	// 	setLoaderState(task_id, true);
	// 	console.log(task_id);
	// 	console.log(amount);

	// 	setTimeout(async () => {
	// 		const userRef = doc(db, "telegramUsers", id.toString());

	// 		const userDoc = await getDoc(userRef);

	// 		if (userDoc.exists()) {
	// 			const { balance } = userDoc.data();
	// 			const newBalance = balance + Number(amount);

	// 			if (!task.includes(id)) {
	// 				await updateDoc(userRef, {
	// 					balance: newBalance,
	// 					task_lists: [...task, task_id],
	// 				});
	// 				setTask([...task, task_id]);

	// 				setTimeout(() => {
	// 					setButtonTypeState(task_id, "");
	// 					setLoaderState(task_id, false);
	// 					setBalance(newBalance);
	// 					notify(`Reward has been claimed`);
	// 				}, 20000);
	// 			}
	// 		}
	// 	}, 1000);
	// };

	// const onDailyClickLink = async (amount, task_id, image, checkDaily) => {
	// 	// if (image) {
	// 	// 	console.log("Daily Telegram has been clicked");
	// 	//
	// 	// } else {

	// 	setDailyButtonType(task_id);
	// 	setIsDailyVerify(true);

	// 	setTimeout(async () => {
	// 		const userRef = doc(db, "telegramUsers", id.toString());

	// 		const userDoc = await getDoc(userRef);

	// 		if (userDoc.exists()) {
	// 			const { balance } = userDoc.data();
	// 			const newBalance = balance + Number(amount);

	// 			if (!dailyTaskList.includes(id)) {
	// 				await updateDoc(userRef, {
	// 					balance: newBalance,
	// 					daily_task_lists: [...dailyTaskList, task_id],
	// 				});
	// 				setDailyTaskList([...dailyTaskList, task_id]);

	// 				setTimeout(() => {
	// 					setDailyButtonType("");
	// 					setIsDailyVerify(false);
	// 					setBalance(newBalance);
	// 					notify(`Reward has been claimed`);
	// 				}, 20000);
	// 			}
	// 		}
	// 	}, 20000);
	// };

	// const onDailyClickLink = async (amount, task_id, image, checkDaily) => {
	// 	if (image === "telegram") {
	// 		console.log("Daily Telegram has been clicked");

	// 		setButtonTypeState(task_id, task_id);
	// 		setLoaderState(task_id, true);

	// 		setTimeout(async () => {
	// 			try {
	// 				const response = await fetch(
	// 					`https://api.telegram.org/bot7318708895:AAEX__GIGjueSNYnBi5f4iwgX1rmdE6KzzI/getChatMember?chat_id=-1002168233017&user_id=${Number(
	// 						id.toString()
	// 					)}`
	// 				);

	// 				const data = await response.json();

	// 				if (
	// 					data.ok &&
	// 					(data.result.status === "member" ||
	// 						data.result.status === "administrator" ||
	// 						data.result.status === "creator")
	// 				) {
	// 					const userRef = doc(db, "telegramUsers", id.toString());
	// 					const userDoc = await getDoc(userRef);

	// 					if (userDoc.exists()) {
	// 						const { balance, daily_task_lists = [] } = userDoc.data();
	// 						const newBalance = balance + Number(amount);

	// 						if (!daily_task_lists.includes(task_id)) {
	// 							await updateDoc(userRef, {
	// 								balance: newBalance,
	// 								daily_task_lists: [...daily_task_lists, task_id],
	// 							});

	// 							setDailyTaskList([...daily_task_lists, task_id]);

	// 							setTimeout(() => {
	// 								// Clear loader and button states for the task
	// 								setButtonTypeState(task_id, "");
	// 								setLoaderState(task_id, false);
	// 								setBalance(newBalance);
	// 								notify(`Reward has been claimed!`);
	// 							}, 20000);
	// 						} else {
	// 							notifyError("This task has already been claimed.");
	// 							setButtonTypeState(task_id, "");
	// 							setLoaderState(task_id, false);
	// 						}
	// 					}
	// 				} else {
	// 					setTimeout(() => {
	// 						notifyError(
	// 							"Please join the Telegram channel first before you can claim this task bonus."
	// 						);
	// 						setButtonTypeState(task_id, "");
	// 						setLoaderState(task_id, false);
	// 					}, 20000);
	// 				}
	// 			} catch (error) {
	// 				setTimeout(() => {
	// 					notifyError("An error occurred while verifying your status.");
	// 					setButtonTypeState(task_id, "");
	// 					setLoaderState(task_id, false);
	// 					console.error("Error verifying Telegram status:", error);
	// 				}, 2000);
	// 			}
	// 		}, 2000);
	// 	} else {
	// 		setButtonTypeState(task_id, task_id);
	// 		setLoaderState(task_id, true);

	// 		setTimeout(async () => {
	// 			const userRef = doc(db, "telegramUsers", id.toString());
	// 			const userDoc = await getDoc(userRef);

	// 			if (userDoc.exists()) {
	// 				const { balance } = userDoc.data();
	// 				const newBalance = balance + Number(amount);

	// 				if (!dailyTaskList.includes(task_id)) {
	// 					await updateDoc(userRef, {
	// 						balance: newBalance,
	// 						daily_task_lists: [...dailyTaskList, task_id],
	// 					});
	// 					setDailyTaskList([...dailyTaskList, task_id]);

	// 					setTimeout(() => {
	// 						setButtonTypeState(task_id, "");
	// 						setLoaderState(task_id, false);
	// 						setBalance(newBalance);
	// 						notify(`Reward has been claimed`);
	// 					}, 20000);
	// 				}
	// 			}
	// 		}, 1000);
	// 	}
	// };

	const [currentTwitterUserName, setCurrentTwitterUserName] = useState("");

	const [fetchedData, setFetchedData] = useState([]);
	const getData = (reward, id, checkDaily) => {
		if (checkDaily) {
			setFetchedData({
				reward: reward,
				id: id,
				checkDaily: checkDaily,
			});
		} else {
			setFetchedData({
				reward: reward,
				id: id,
			});
		}
	};

	const onDailyClickLink = async (amount, task_id, image) => {
		setButtonTypeState(task_id, task_id);
		setLoaderState(task_id, true);

		setTimeout(async () => {
			const userRef = doc(db, "telegramUsers", id.toString());
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				const { balance, daily_task_lists = [] } = userDoc.data();
				const newBalance = balance + Number(amount);

				if (!daily_task_lists.includes(task_id)) {
					await updateDoc(userRef, {
						balance: newBalance,
						daily_task_lists: [...daily_task_lists, task_id],
					});
					setDailyTaskList([...daily_task_lists, task_id]);

					setTimeout(() => {
						setButtonTypeState(task_id, "");
						setLoaderState(task_id, false);
						setBalance(newBalance);
						notify(`Reward has been claimed`);
					}, 20000);
				} else {
					notifyError("This task has already been claimed.");
					setButtonTypeState(task_id, "");
					setLoaderState(task_id, false);
				}
			}
		}, 1000);
	};

	// const [fetchedChannelData, setFetchedChannelData] = useState([]);

	// const getChannelData = (reward, id, checkDaily) => {
	// 	if (checkDaily) {
	// 		setFetchedChannelData({
	// 			reward: reward,
	// 			id: id,
	// 			checkDaily: checkDaily,
	// 		});
	// 	} else {
	// 		setFetchedChannelData({
	// 			reward: reward,
	// 			id: id,
	// 		});
	// 	}
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLinkVerify(true);
		try {
			if (currentTwitterUserName === "") {
				notifyError("Please enter valid Twitter username");
			} else {
				await updateTwitterName(currentTwitterUserName);

				setTimeout(() => {
					if (fetchedData.checkDaily) {
						onDailyClickLink(fetchedData.reward, fetchedData.id, "twitter");
					} else {
						onClickLink(fetchedData.reward, fetchedData.id, "twitter");
					}
				}, 700);

				setIsTwitter(false);
			}
		} catch (e) {
			console.error("Error adding document: ", e);
		} finally {
			setCurrentTwitterUserName("");
		}
	};

	// const onClickAnnouncementLink = async (amount) => {
	// 	try {
	// 		const userRef = doc(db, "telegramUsers", id.toString());
	// 		const userDoc = await getDoc(userRef);

	// 		if (userDoc.exists()) {
	// 			const { balance, announcementReward } = userDoc.data();

	// 			if (announcementReward && announcementReward.status === "verified") {
	// 				const newBalance = balance + Number(amount);

	// 				await updateDoc(userRef, {
	// 					balance: newBalance,
	// 				});

	// 				setTimeout(() => {
	// 					setBalance(newBalance);
	// 					notify(`Reward has been claimed successfully!`);
	// 				}, 20000);
	// 			} else {
	// 				notifyError("Announcement reward is not verified.");
	// 			}
	// 		} else {
	// 			notifyError("User document does not exist.");
	// 		}
	// 	} catch (error) {
	// 		console.error("Error while claiming reward:", error);
	// 		notifyError("An error occurred while claiming the reward.");
	// 	}
	// };

	const [announcementReward, setAnnouncementReward] = useState({
		link: "",
		status: "notVerified",
		timestamp: null,
	});

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchAnnouncementReward();
			setAnnouncementReward(data);
		};

		fetchData();
	}, [fetchAnnouncementReward]);

	const [currentAnnouncementLink, setCurrentAnnouncementLink] = useState("");
	const [isValidURL, setIsValidURL] = useState(true);
	const urlPattern = new RegExp(
		/^(https?:\/\/)?([a-zA-Z0-9.-]+)?\.[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?$/
	);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setCurrentAnnouncementLink(value);
		setIsValidURL(urlPattern.test(value));
	};

	const handleAnnouncementLink = async (amount) => {
		console.log(amount);
		try {
			if (isValidURL && currentAnnouncementLink !== "") {
				await updateAnnouncementLink(currentAnnouncementLink, "verifying");
				notify("URL saved successfully");

				setTimeout(async () => {
					try {
						await updateAnnouncementLink(currentAnnouncementLink, "verified");

						const userRef = doc(db, "telegramUsers", id.toString());
						const userDoc = await getDoc(userRef);

						if (userDoc.exists()) {
							const { balance, announcementReward } = userDoc.data();

							if (
								announcementReward &&
								announcementReward.status === "verified"
							) {
								const newBalance = Number(balance) + Number(amount);

								await updateDoc(userRef, {
									balance: Number(newBalance),
								});

								setBalance(newBalance);
								notify(`Reward has been claimed successfully!`);
							} else {
								notifyError("Announcement reward is not verified.");
							}
						} else {
							notifyError("User document does not exist.");
						}
					} catch (rewardError) {
						console.error("Error during reward claiming: ", rewardError);
						notifyError("An error occurred while claiming the reward.");
					}
				}, 20000);
				setIsOpen(false);
			} else {
				notifyError("Please enter a valid URL");
			}
		} catch (error) {
			console.error("Error updating announcement: ", error);
		} finally {
			setCurrentAnnouncementLink("");
		}
	};

	// const [userLink, setUserLink] = useState("");

	// const handleLink = async (e) => {
	// 	e.preventDefault();
	// 	setIsLinkVerify(true);

	// 	setUserLink("");

	// 	console.log(taskId, userLink);
	// };

	const [isOpen, setIsOpen] = useState(false);

	const handleAnnouncement = () => {
		setIsOpen(true);
	};

	return (
		<>
			<Toaster
				position='top'
				icons={{
					success: <PiCheckCircleFill className='text-green-500 w-5 h-5' />,
				}}
			/>

			<div className="w-full min-h-screen pb-20 text-white flex flex-col items-center gap-6 font-sans bg-[url('/src/assets/MainBackground.png')] overflow-x-hidden pt-5 px-3 bg-cover ">
				<TaskPageDialog></TaskPageDialog>
				<div className='flex justify-start w-full items-center '>
					<button className='bg-[linear-gradient(90deg,#112946_0%,#2823A9_50%,#2100EC_100%)] flex gap-2 items-center px-4 py-2  rounded-full'>
						<span className='text-xs'>Tutorial: How to score</span>
					</button>
				</div>
				<div className='flex items-center gap-2  '>
					<img
						src={kvaiCoin}
						alt=''
					/>
					<h1 className='text-4xl font-bold'>{balance}</h1>
				</div>
				<div className=' w-full'>
					<hr />
				</div>

				<div className='flex max-h-[1000px] overflow-y-auto flex-col gap-4 w-full '>
					<div className='w-full flex items-start justify-start'>
						<h4>Daily Tasks</h4>
					</div>
					<div className='flex flex-col  gap-2 w-full  max-h-[250px] '>
						<div
							onClick={setReward}
							className=' bg-[linear-gradient(180.64deg,#3919FF_-1.34%,#1C020D_116.51%)]    cursor-pointer px-3 py-3  rounded-[20px] w-full flex items-center gap-4 relative'>
							{claimed?.includes(value.day) ? (
								<img
									src={completed_img}
									alt=''
								/>
							) : (
								<img
									src={incomplete_img}
									alt=''
								/>
							)}
							<div className='flex gap-2 items-center '>
								<div className='flex flex-col'>
									<span className=''>Daily Reward</span>
									<div className='flex items-center gap-1 text-sm '>
										<img
											src={kvaiCoin}
											alt=''
											className='w-5 h-5'
										/>
										<span>{value.reward}</span>
									</div>
								</div>
								<a className='absolute -top-4 right-0 z-10'>
									<img
										src={dailyreward}
										alt=''
									/>
								</a>
							</div>
						</div>
					</div>

					<div className='flex flex-col gap-y-[20px] w-full py-5'>
						{dailyTask
							?.sort((a, b) => a.priority - b.priority)
							.map((item) => (
								<TaskItem
									key={item.id}
									{...item}
									onClick={onDailyClickLink}
									isButtonType={isButtonType}
									isVerify={isVerify}
									task={dailyTaskList}
									setIsTwitter={setIsTwitter}
									getData={getData}
									checkDaily={true}
								/>
							))}
					</div>

					<div className='flex flex-col gap-4 w-full '>
						<div className='w-full flex items-start justify-start'>
							<h4>Promotion Task</h4>
						</div>
						<div className='flex flex-col  gap-2 w-full  max-h-[250px] '>
							{/* <div
								onClick={handleAnnouncement}
								className=' bg-[linear-gradient(180.64deg,#3919FF_-1.34%,#1C020D_116.51%)]    cursor-pointer px-3 py-3  rounded-[20px] w-full flex items-center gap-4 relative'>
								{claimedIcon ? (
									<img
										src={completed_img}
										alt=''
									/>
								) : (
									<img
										src={incomplete_img}
										alt=''
									/>
								)}
								<div className='flex gap-2 items-center '>
									<div className='flex flex-col'>
										<span className=''>Announcement Reward</span>
										<div className='flex items-center gap-1 text-sm '>
											<img
												src={kvaiCoin}
												alt=''
												className='w-5 h-5'
											/>
											<span>{announcement.reward}</span>
										</div>
									</div>
									<a className='absolute -top-4 right-0 z-10 '>
										<img
											src={dailyreward}
											alt=''
										/>
									</a>
								</div>
							</div> */}
							<AnnouncementHandle
								handleClick={handleAnnouncementLink}
								onClick={handleAnnouncement}
								status={announcementReward.status}
								reward={announcement.reward}
								task={dailyTaskList}
							/>
						</div>
					</div>
					<div
						className={`w-full z-20 ${
							isOpen ? "visible" : "invisible"
						} h-[100vh] absolute bottom-0 left-0 right-0`}>
						<div className="w-full flex items-center backdrop-blur-md  bg-[url('/src/assets/MainBackground.png')] bg-no-repeat bg-cover bg-center min-h-screen justify-center flex-col overflow-y-auto">
							<div className='bg-gradient-to-r from-[#FF9463] to-[#A51CF5] w-[280px] h-[50px] p-[1px] rounded-full self-center'>
								<div className='bg-[#070C38] flex items-center h-full p-[7px] rounded-full'>
									<p className='flex-1 text-center krona text-[16px] text-white'>
										Announcement
									</p>
									<button
										onClick={() => setIsOpen(false)}
										className='flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]'>
										<svg
											width='20'
											height='20'
											viewBox='0 0 20 20'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												d='M12 12L10 10L12 12ZM10 10L8 8L10 10ZM10 10L8 12L10 10ZM10 10L12 8L10 10ZM10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13737 15.5282 2.80031 16.364 3.63604C17.1997 4.47177 17.8626 5.46392 18.3149 6.55585C18.7672 7.64778 19 8.8181 19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C7.61305 19 5.32387 18.0518 3.63604 16.364C1.94821 14.6761 1 12.3869 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1Z'
												fill='url(#paint0_linear_150_1565)'
												fill-opacity='0.15'
											/>
											<path
												d='M12 12L10 10M10 10L8 8M10 10L8 12M10 10L12 8M10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13738 15.5282 2.80031 16.364 3.63604C17.1997 4.47177 17.8626 5.46392 18.3149 6.55585C18.7672 7.64778 19 8.8181 19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C7.61305 19 5.32387 18.0518 3.63604 16.364C1.94821 14.6761 1 12.3869 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1Z'
												stroke='url(#paint1_linear_150_1565)'
												stroke-width='2'
												stroke-linecap='round'
												stroke-linejoin='round'
											/>
											<defs>
												<linearGradient
													id='paint0_linear_150_1565'
													x1='19'
													y1='19'
													x2='1'
													y2='19'
													gradientUnits='userSpaceOnUse'>
													<stop stop-color='#FFE89E' />
													<stop
														offset='1'
														stop-color='#FFD76D'
													/>
												</linearGradient>
												<linearGradient
													id='paint1_linear_150_1565'
													x1='19'
													y1='19'
													x2='1'
													y2='19'
													gradientUnits='userSpaceOnUse'>
													<stop stop-color='#FFE89E' />
													<stop
														offset='1'
														stop-color='#FFD76D'
													/>
												</linearGradient>
											</defs>
										</svg>
									</button>
								</div>
							</div>
							<div className='w-[250px] h-[250px] py-3 overflow-hidden flex items-center justify-center'>
								<img
									src={announcement.image}
									alt=''
									className='object-cover w-full h-full'
								/>
							</div>
							<div className='w-[295px] rounded-[20px] bg-gradient-to-b from-[#F8A1A1] to-[#290404] p-[1px] self-center'>
								<div className='w-full rounded-[20px] bg-gradient-to-b from-[#000DA9] to-[#000543] p-4 flex flex-col '>
									<div className='flex justify-between'>
										<img
											src={NotificationRight}
											alt=''
											className='w-[75px] h-[75px]'
										/>
										<p className='text-center font-bold text-lg text-white my-[20px]'>
											{announcement.title}
										</p>
										<img
											src={Notificationleft}
											alt=''
											className='w-[75px] h-[75px]'
										/>
									</div>
									<div className='rounded-[20px] bg-gradient-to-b from-[#F8A1A1] to-[#290404] p-[1px] w-full mt-[11px]'>
										<div className='rounded-[20px] bg-gradient-to-b from-[#000DA9] to-[#57596E] p-[4px] w-full flex items-center text-[14px] gap-x-[5px] justify-center'>
											<img
												src={kvai}
												alt=''
												className='w-[33px] h-[33px]'
											/>
											<p className='notification'>{announcement.reward}</p>
										</div>
									</div>
									<p className='text-center font-bold text-lg text-white my-[20px]'>
										{announcement.subTitle}
									</p>

									<p className='text-center text-white text-sm leading-[100%] mb-[20px]'>
										{announcement.description}
									</p>
									<input
										type='text'
										id='currentAnnouncementLink'
										value={currentAnnouncementLink}
										onChange={handleInputChange}
										placeholder='Paste URL'
										className='bg-white text-black border-red rounded-full p-[6px] w-full text-center'
									/>
									<div
										onClick={() => handleAnnouncementLink(announcement.reward)}
										className='h-[38px] w-[120px] bg-gradient-to-b from-[#4D4351] p-[1px] rounded-full mt-[10px] self-center'>
										<div className='w-full h-full bg-gradient-to-b from-[#2E3272] to-[#1D25AD] p-[4px] rounded-full'>
											<div className='w-full h-full bg-gradient-to-b from-[#4D4351] p-[1px] rounded-full'>
												<button className='w-full h-full bg-black text-white flex items-center justify-center rounded-full'>
													Submit
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='w-full flex items-start justify-start'>
						<h4>Task List</h4>
					</div>
					<div className='flex flex-col gap-y-[20px] w-full py-5'>
						{socialTask
							?.sort((a, b) => a.priority - b.priority)
							.map((item) => (
								<TaskItem
									key={item.id}
									{...item}
									onClick={onClickLink}
									isButtonType={isButtonType}
									isVerify={isVerify}
									task={task}
									setIsTwitter={setIsTwitter}
									getData={getData}
								/>
							))}
					</div>
				</div>
				<div className='fixed bottom-4'>
					<Footer currentPage={4}></Footer>
				</div>
			</div>

			<div
				className={`${
					isReward ? "visible" : "invisible"
				} h-[100vh] absolute bottom-0 left-0 right-0`}>
				<div
					className={`fixed bottom-0 left-0 right-0 h-fit modal_background  bg-[url('/src/assets/MainBackground.png')] bg-no-repeat bg-cover  border-t-2 border-purple-950  z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center container-1 pb-[12px] pt-[25px] px-[25px]`}>
					<div className='w-full flex flex-col justify-between'>
						<button
							onClick={() => setReward(false)}
							className='flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]'>
							<svg
								width='20'
								height='20'
								viewBox='0 0 20 20'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M12 12L10 10L12 12ZM10 10L8 8L10 10ZM10 10L8 12L10 10ZM10 10L12 8L10 10ZM10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13737 15.5282 2.80031 16.364 3.63604C17.1997 4.47177 17.8626 5.46392 18.3149 6.55585C18.7672 7.64778 19 8.8181 19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C7.61305 19 5.32387 18.0518 3.63604 16.364C1.94821 14.6761 1 12.3869 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1Z'
									fill='url(#paint0_linear_150_1565)'
									fill-opacity='0.15'
								/>
								<path
									d='M12 12L10 10M10 10L8 8M10 10L8 12M10 10L12 8M10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13738 15.5282 2.80031 16.364 3.63604C17.1997 4.47177 17.8626 5.46392 18.3149 6.55585C18.7672 7.64778 19 8.8181 19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C7.61305 19 5.32387 18.0518 3.63604 16.364C1.94821 14.6761 1 12.3869 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1Z'
									stroke='url(#paint1_linear_150_1565)'
									stroke-width='2'
									stroke-linecap='round'
									stroke-linejoin='round'
								/>
								<defs>
									<linearGradient
										id='paint0_linear_150_1565'
										x1='19'
										y1='19'
										x2='1'
										y2='19'
										gradientUnits='userSpaceOnUse'>
										<stop stop-color='#FFE89E' />
										<stop
											offset='1'
											stop-color='#FFD76D'
										/>
									</linearGradient>
									<linearGradient
										id='paint1_linear_150_1565'
										x1='19'
										y1='19'
										x2='1'
										y2='19'
										gradientUnits='userSpaceOnUse'>
										<stop stop-color='#FFE89E' />
										<stop
											offset='1'
											stop-color='#FFD76D'
										/>
									</linearGradient>
								</defs>
							</svg>
						</button>

						<div className='w-full flex  justify-center flex-col items-center mb-[26px] text-white'>
							<h3 className='font-semibold text-[26px] xs:text-[32px] mb-[13px]'>
								Win Rewards Daily
							</h3>
							<div className=' flex items-center justify-center mb-[16px]'>
								<img
									alt='claim'
									src={award}
									className='w-[80px] xs:w-[120px]'
								/>
							</div>
							<p className='text-[16px] text-center -mb-2 xs:pb-2 xs:-mb-0'>
								Earn coins by logging in game daily! Don't &nbsp;
								<br className='hidden xs:block' />
								miss a day, or your streak will reset.
							</p>
						</div>
						<div className='grid grid-cols-3 justify-center gap-x-[16px] gap-y-[16px]'>
							<div
								className={` ${
									value?.day == 0 ? "border border-[#56CC7A]" : "bg-[#910FF71A]"
								} py-[3px] px-[4px] flex flex-col justify-center items-center bg-[#35323D] bg-gradient-to-tr from-[#4C4954]  rounded-[8px] text-white  `}>
								<p className='text-[16px] font-semibold'>Day 1</p>
								<img
									src={
										claimed?.includes(0)
											? completed_img
											: value?.day == 0
											? kvaiCoin
											: KvantCoinBlack
									}
									className='w-[40px] h-full mt-[8px] mb-[6px]'></img>
								<p className='text-white  text-[16px] font-semibold'>500</p>
							</div>
							<div
								className={`
                  ${value?.day == 1 ? "border border-[#56CC7A]" : "border-none"}
                 py-[3px] px-[4px] flex flex-col justify-center items-center bg-[#35323D] bg-gradient-to-tr from-[#4C4954]  rounded-[8px] text-white  `}>
								<p className='text-[16px] font-semibold'>Day 2</p>
								<img
									src={
										claimed?.includes(1)
											? completed_img
											: value?.day == 1
											? kvaiCoin
											: KvantCoinBlack
									}
									className='w-[45px] h-[42px] mt-[8px] mb-[6px]'></img>
								<p className='text-white  text-[16px] font-semibold'>1000</p>
							</div>
							<div
								className={`
                  ${value?.day == 2 ? "border border-[#56CC7A]" : "border-none"}
                 py-[3px] px-[4px] flex flex-col justify-center items-center bg-[#35323D] bg-gradient-to-tr from-[#4C4954]  rounded-[8px] text-white  `}>
								<p className='text-[16px] font-semibold'>Day 3</p>
								<img
									src={
										claimed?.includes(2)
											? completed_img
											: value?.day == 2
											? kvaiCoin
											: KvantCoinBlack
									}
									className='w-[45px] h-[42px] mt-[8px] mb-[6px]'></img>
								<p className='text-white  text-[16px] font-semibold'>2000</p>
							</div>
							<div
								className={`
                  ${value?.day == 3 ? "border border-[#56CC7A]" : "border-none"}
                 py-[3px] px-[4px] flex flex-col justify-center items-center bg-[#35323D] bg-gradient-to-tr from-[#4C4954]  rounded-[8px] text-white  `}>
								<p className='text-[16px] font-semibold'>Day 4</p>
								<img
									src={
										claimed?.includes(3)
											? completed_img
											: value?.day == 3
											? kvaiCoin
											: KvantCoinBlack
									}
									className='w-[45px] h-[42px] mt-[8px] mb-[6px]'></img>
								<p className='text-white  text-[16px] font-semibold'>5000</p>
							</div>
							<div
								className={`
                  ${value?.day == 4 ? "border border-[#56CC7A]" : "border-none"}
                 py-[3px] px-[4px] flex flex-col justify-center items-center bg-[#35323D] bg-gradient-to-tr from-[#4C4954]  rounded-[8px] text-white  `}>
								<p className='text-[16px] font-semibold'>Day 5</p>
								<img
									src={
										claimed?.includes(4)
											? completed_img
											: value?.day == 4
											? kvaiCoin
											: KvantCoinBlack
									}
									className='w-[45px] h-[42px] mt-[8px] mb-[6px]'></img>
								<p className='text-white  text-[16px] font-semibold'>10000</p>
							</div>
							<div
								className={`
                  ${value?.day == 5 ? "border border-[#56CC7A]" : "border-none"}
                 py-[3px] px-[4px] flex flex-col justify-center items-center bg-[#35323D] bg-gradient-to-tr from-[#4C4954]  rounded-[8px] text-white  `}>
								<p className='text-[16px] font-semibold'>Day 6</p>
								<img
									src={
										claimed?.includes(5)
											? completed_img
											: value?.day == 5
											? kvaiCoin
											: KvantCoinBlack
									}
									className='w-[45px] h-[42px] mt-[8px] mb-[6px]'></img>
								<p className='text-white  text-[16px] font-semibold'>25000</p>
							</div>
							<div></div>
							<div
								className={`
                  ${value?.day == 6 ? "border border-[#56CC7A]" : "border-none"}
                  
                 py-[3px] px-[4px] flex flex-col justify-center items-center bg-[#35323D] bg-gradient-to-tr from-[#4C4954]  rounded-[8px] text-white  `}>
								<p className='text-[16px] font-semibold'>Day 7</p>
								<img
									src={
										claimed?.includes(6)
											? completed_img
											: value?.day == 6
											? kvaiCoin
											: KvantCoinBlack
									}
									className='w-[45px] h-[42px] mt-[8px] mb-[6px]'></img>
								<p className='text-white  text-[16px] font-semibold'>50000</p>
							</div>
						</div>

						<button
							onClick={() => handle(value)}
							className='  border border-[#A51CF5] text-white py-[10px] px-[4px] mx-auto rounded-full w-[283px] mt-[16px] text-[16px] bg-transparent '>
							Collect
						</button>
					</div>
				</div>
			</div>
			{/* <div
				className={`${
					isMoreLink ? "visible" : "invisible"
				} h-[100vh] absolute bottom-0 left-0 right-0`}>
				<div
					className={` fixed bottom-0 left-0 right-0 h-fit modal_background bg-[#0A031880] backdrop-blur-md  bg-no-repeat bg-cover  border-t-2 border-purple-950  z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center container-1 pb-[12px] pt-[25px] px-[25px]`}>
					<div className='w-full flex flex-col justify-between'>
						<button
							onClick={() => {
								// setIsMoreLink(false);
								setPost(true);
								setUserLink("");
							}}
							className='flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]'>
							<svg
								width='20'
								height='20'
								viewBox='0 0 20 20'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M12 12L10 10L12 12ZM10 10L8 8L10 10ZM10 10L8 12L10 10ZM10 10L12 8L10 10ZM10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13737 15.5282 2.80031 16.364 3.63604C17.1997 4.47177 17.8626 5.46392 18.3149 6.55585C18.7672 7.64778 19 8.8181 19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C7.61305 19 5.32387 18.0518 3.63604 16.364C1.94821 14.6761 1 12.3869 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1Z'
									fill='url(#paint0_linear_150_1565)'
									fill-opacity='0.15'
								/>
								<path
									d='M12 12L10 10M10 10L8 8M10 10L8 12M10 10L12 8M10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13738 15.5282 2.80031 16.364 3.63604C17.1997 4.47177 17.8626 5.46392 18.3149 6.55585C18.7672 7.64778 19 8.8181 19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C7.61305 19 5.32387 18.0518 3.63604 16.364C1.94821 14.6761 1 12.3869 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1Z'
									stroke='url(#paint1_linear_150_1565)'
									stroke-width='2'
									stroke-linecap='round'
									stroke-linejoin='round'
								/>
								<defs>
									<linearGradient
										id='paint0_linear_150_1565'
										x1='19'
										y1='19'
										x2='1'
										y2='19'
										gradientUnits='userSpaceOnUse'>
										<stop stop-color='#FFE89E' />
										<stop
											offset='1'
											stop-color='#FFD76D'
										/>
									</linearGradient>
									<linearGradient
										id='paint1_linear_150_1565'
										x1='19'
										y1='19'
										x2='1'
										y2='19'
										gradientUnits='userSpaceOnUse'>
										<stop stop-color='#FFE89E' />
										<stop
											offset='1'
											stop-color='#FFD76D'
										/>
									</linearGradient>
								</defs>
							</svg>
						</button>

						<div className='w-full grid grid-cols-2 gap-x-[20px] gap-y-[37px] py-16'>
							<div className='w-full relative'>
								<img
									src={ReTweet}
									className='w-[57px] h-[55px] absolute -left-3 -top-1'
									alt=''
								/>
								<button className='py-[5px] w-full text-center pl-3 text-[18px] text-white moreLinkButton border-[#FFFFFF] border rounded-[20px]'>
									Retweet
								</button>
							</div>
							<div className='w-full relative'>
								<img
									src={like}
									className='w-[65px] h-[65px] absolute -left-3 -top-2'
									alt=''
								/>
								<button className='py-[5px] w-full text-center pl-3 text-[18px] text-white moreLinkButton border-[#FFFFFF] border rounded-[20px]'>
									Like
								</button>
							</div>
							<div className='w-full relative'>
								<img
									src={comment}
									className='w-[51px] h-[57px] absolute -left-3 -top-2'
									alt=''
								/>
								<button className='py-[5px] w-full text-center pl-3 text-[18px] text-white moreLinkButton border-[#FFFFFF] border rounded-[20px]'>
									Comment
								</button>
							</div>
						</div>

						{post ? (
							<button
								onClick={() => setPost(false)}
								className='moreLinkButton  border border-[#A51CF5] text-white py-[10px] px-[4px] mx-auto rounded-full w-[283px] mb-14 text-[16px] bg-transparent '>
								View Post
							</button>
						) : (
							<>
								<div className='w-full -mt-3 pb-10 relative '>
									<input
										type='text'
										id='userLink'
										value={userLink}
										onChange={(e) => setUserLink(e.target.value)}
										placeholder='Enter URL here'
										className='bg-white px-[32px] py-[8px] text-[16px] focus:outline-none  w-full text-[#332828] placeholder:text-[#332828] rounded-[20px] '
									/>
								</div>
								<button
									onClick={(e) => handleLink(e)}
									className='moreLinkButton  border border-[#A51CF5] text-white py-[10px] px-[4px] mx-auto rounded-full w-[283px] mb-14 text-[16px] bg-transparent '>
									Click Here
								</button>
							</>
						)}
					</div>
				</div>
			</div> */}
			<div
				className={`${
					isTwitter ? "visible" : "invisible"
				} absolute top-0 left-0 right-0`}>
				<div
					className={` fixed top-0 left-0 right-0 h-fit modal_background bg-[#0A031880] backdrop-blur-md  bg-no-repeat bg-cover  border-t-2 border-purple-950  z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center container-1 pb-[12px] pt-[25px] px-[25px]`}>
					<div className='w-full flex flex-col justify-between'>
						<div className='mx-auto'>
							<p className='text-white font-bold text-2xl'>
								Verify your Twitter
							</p>
						</div>
						<div className='text-white mt-5'>
							<p>
								Please submit your twitter username here to get rewards claimed
							</p>
						</div>
						<button
							onClick={() => setIsTwitter(false)}
							className='flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]'>
							<svg
								width='20'
								height='20'
								viewBox='0 0 20 20'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M12 12L10 10L12 12ZM10 10L8 8L10 10ZM10 10L8 12L10 10ZM10 10L12 8L10 10ZM10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13737 15.5282 2.80031 16.364 3.63604C17.1997 4.47177 17.8626 5.46392 18.3149 6.55585C18.7672 7.64778 19 8.8181 19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C7.61305 19 5.32387 18.0518 3.63604 16.364C1.94821 14.6761 1 12.3869 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1Z'
									fill='url(#paint0_linear_150_1565)'
									fill-opacity='0.15'
								/>
								<path
									d='M12 12L10 10M10 10L8 8M10 10L8 12M10 10L12 8M10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13738 15.5282 2.80031 16.364 3.63604C17.1997 4.47177 17.8626 5.46392 18.3149 6.55585C18.7672 7.64778 19 8.8181 19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C7.61305 19 5.32387 18.0518 3.63604 16.364C1.94821 14.6761 1 12.3869 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1Z'
									stroke='url(#paint1_linear_150_1565)'
									stroke-width='2'
									stroke-linecap='round'
									stroke-linejoin='round'
								/>
								<defs>
									<linearGradient
										id='paint0_linear_150_1565'
										x1='19'
										y1='19'
										x2='1'
										y2='19'
										gradientUnits='userSpaceOnUse'>
										<stop stop-color='#FFE89E' />
										<stop
											offset='1'
											stop-color='#FFD76D'
										/>
									</linearGradient>
									<linearGradient
										id='paint1_linear_150_1565'
										x1='19'
										y1='19'
										x2='1'
										y2='19'
										gradientUnits='userSpaceOnUse'>
										<stop stop-color='#FFE89E' />
										<stop
											offset='1'
											stop-color='#FFD76D'
										/>
									</linearGradient>
								</defs>
							</svg>
						</button>

						<div className='flex flex-col gap-y-[15px] py-10'>
							<div className='w-full  relative '>
								<input
									type='text'
									id='currentTwitterUserName'
									value={currentTwitterUserName}
									onChange={(e) => setCurrentTwitterUserName(e.target.value)}
									placeholder='Enter Your Twitter Username'
									className='bg-white px-[32px] py-[8px] text-[16px] focus:outline-none  w-full text-[#332828] placeholder:text-[#332828] rounded-[20px] '
								/>
								{/* <img
									src={search}
									alt='search'
									className='absolute -right-1 -top-[2px] h-[45px] w-[40px]'
								/> */}
							</div>
							<button
								onClick={handleSubmit}
								className='moreLinkButton  border border-[#A51CF5] text-white py-[10px] px-[4px] mx-auto rounded-full w-[283px] mt-[16px] text-[16px] bg-transparent '>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Task;
