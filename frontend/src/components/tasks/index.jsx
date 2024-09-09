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
import axios from 'axios';

import { notify, notifyError } from "../../utils/notify";
import { Toaster } from "sonner";
import { PiCheckCircleFill } from "react-icons/pi";
import TaskItem from "./taskItem";
import Footer from "../common/footer";
import TaskPageDialog from "./dilog";
import AnnouncementHandle from "./announcementHandle";
import { useLoader } from "../LoaderContext";

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
	const { isVerify, setLoaderState, isButtonType, setButtonTypeState } = useLoader();
	const apiUrl = process.env.REACT_APP_API_URL;
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

	// 1 fun to change ---- >
	const handle = async (value) => {
		try {
			const response = await axios.post(`${apiUrl}/claim`, {
				userId: id.toString(), // Adjust this if necessary
				reward: value.reward,
				day: value.day,
			})

			const data = await response.json();

			if (response.ok) {
				if (value.day === 6) {
					setClaimed([]);
				} else {
					setClaimed(prevClaimed => [...prevClaimed, value.day]);
				}

				notify(data.message);
				setButton(false);
				setReward(false);
				sendUserData();
				selection();
			} else {
				notifyError(data.message);
			}
		} catch (error) {
			console.error('Error claiming referral reward:', error);
			notifyError('An unexpected error occurred.');
		}
	};

	// 2 fun to change ---- >
	const verifyTelegramMembership = async (userId) => {
		try {
			const response = await axios.post(`${apiUrl}/verify-telegram`, {
				userId: userId
			})

			const data = await response.json();

			if (response.ok && data.isMember) {
				return true;
			} else {
				throw new Error(data.message || 'Error verifying membership.');
			}
		} catch (error) {
			console.error('Error verifying Telegram status:', error);
			throw error;
		}
	};

	// 3 fun to change ---- >
	const onClickLink = async (amount, task_id, image) => {
		setButtonTypeState(task_id, task_id);
		setLoaderState(task_id, true);
		console.log(task_id);
		console.log(amount);

		try {
			const response = await axios.post(`${apiUrl}/claim-task`, {
				userId: id.toString(),
				amount,
				taskId: task_id,
				image
			})

			const data = await response.json();

			if (response.ok) {
				setTask(prevTask => [...prevTask, task_id]);
				setBalance(data.newBalance);

				setTimeout(() => {
					setButtonTypeState(task_id, "");
					setLoaderState(task_id, false);
					notify(data.message);
				}, 20000);
			} else {
				setTimeout(() => {
					notifyError(data.message);
					setButtonTypeState(task_id, "");
					setLoaderState(task_id, false);
				}, 2000);
			}
		} catch (error) {
			setTimeout(() => {
				notifyError("An error occurred during the verification process.");
				setButtonTypeState(task_id, "");
				setLoaderState(task_id, false);
			}, 2000);
		}
	};

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

	// 4 fun to change ---- >
	const onDailyClickLink = async (amount, task_id, image) => {
		setButtonTypeState(task_id, task_id);
		setLoaderState(task_id, true);

		try {
			const response = await fetch(`${apiUrl}/claim-daily-task`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: id.toString(),
					amount,
					taskId: task_id,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setDailyTaskList(prevDailyTaskList => [...prevDailyTaskList, task_id]);
				setBalance(data.newBalance);

				setTimeout(() => {
					setButtonTypeState(task_id, "");
					setLoaderState(task_id, false);
					notify(data.message);
				}, 20000);
			} else {
				setTimeout(() => {
					notifyError(data.message);
					setButtonTypeState(task_id, "");
					setLoaderState(task_id, false);
				}, 2000);
			}
		} catch (error) {
			setTimeout(() => {
				notifyError("An error occurred during the process.");
				setButtonTypeState(task_id, "");
				setLoaderState(task_id, false);
			}, 2000);
		}
	};

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


	// 5 fun to change ---- >
	const handleAnnouncementLink = async (amount) => {
		console.log(amount);

		try {
			const response = await fetch(`${apiUrl}/handle-announcement`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: id.toString(),
					amount,
					currentAnnouncementLink,
					isValidURL,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				notify(data.message);

				// Update the balance if needed
				if (data.newBalance !== undefined) {
					setBalance(data.newBalance);
				}

				setIsOpen(false);
			} else {
				notifyError(data.message);
			}
		} catch (error) {
			console.error("Error during announcement handling:", error);
			notifyError("An error occurred during the process.");
		} finally {
			setCurrentAnnouncementLink("");
		}
	};

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
						className={`w-full z-20 ${isOpen ? "visible" : "invisible"
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
				className={`${isReward ? "visible" : "invisible"
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
								className={` ${value?.day == 0 ? "border border-[#56CC7A]" : "bg-[#910FF71A]"
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
			<div
				className={`${isTwitter ? "visible" : "invisible"
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
