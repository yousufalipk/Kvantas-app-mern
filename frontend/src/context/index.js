import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	useCallback,
} from "react";
import { debounce } from "../utils/debounce";
import axios from 'axios';

const UserContext = createContext();
const tele = window.Telegram?.WebApp;

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {

	const apiUrl = process.env.REACT_APP_API_URL;

	useEffect(() => {
		console.log("BACKEND PATH", apiUrl);
	})

	const staticUser = process.env.REACT_APP_STATIC_USER;

	const [balance, setBalance] = useState(0);

	const [tapBalance, setTapBalance] = useState(0);

	const [level, setLevel] = useState({
		id: 1,
		name: "Bronze",
		imgUrl: "/bronze.webp",
	}); // Initial level as an object with id and name

	const [tapValue, setTapValue] = useState({ level: 1, value: 1 });

	const [timeRefill, setTimeRefill] = useState({
		level: 1,
		duration: 10,
		step: 600,
	});

	const [id, setId] = useState("");

	const [loading, setLoading] = useState(true);

	const [energy, setEnergy] = useState(500);

	const [battery, setBattery] = useState({ level: 1, energy: 500 });

	const [initialized, setInitialized] = useState(false);

	const [refBonus, SetRefBonus] = useState(0);

	const [manualTasks, setManualTasks] = useState([]);

	const [userManualTasks, setUserManualTasks] = useState([]);

	const [tasks, setTasks] = useState([]);

	const [completedTasks, setCompletedTasks] = useState([]); // State to hold completed tasks

	const [claimedMilestones, setClaimedMilestones] = useState([]);

	const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);

	const [referrals, setReferrals] = useState([]); // State to hold referrals

	const [refiller, setRefiller] = useState(0);

	const { count, setCount } = useState(0);

	const [tapGuru, setTapGuru] = useState(false);

	const [mainTap, setMainTap] = useState(true);

	const [time, setTime] = useState(22);

	const [isTimerRunning, setIsTimerRunning] = useState(false);

	const [freeGuru, setFreeGuru] = useState(3);

	const [fullTank, setFullTank] = useState(3);

	const [timeSta, setTimeSta] = useState(null);

	const [timeStaTank, setTimeStaTank] = useState(null);

	const [username, setUsername] = useState("");

	const [daily_claimed, setDaily_claimed] = useState("");

	const [idme, setIdme] = useState("");

	const [totalCount, setTotalCount] = useState(0);

	const [dividedCount, setDividedCount] = useState(0);

	const [users, setUsers] = useState(0);

	const [dividedUsers, setDividedUsers] = useState(0);

	const [taskCompleted, setTaskCompleted] = useState(false);

	const [taskCompleted2, setTaskCompleted2] = useState(false);

	const [isUserExist, setIsUserExist] = useState(false);

	const refillIntervalRef = useRef(null);

	const [isRefilling, setIsRefilling] = useState(false);

	const [rewardIndex, setCurrentReward] = useState(0);

	const [powerIndex, setPowerIndex] = useState(0);

	const [isLoadingMain, setLoadingMain] = useState(false);

	const accumulatedEnergyRef = useRef(energy);

	const [claimed, setClaimed] = useState([]);

	const [task, setTask] = useState([]);

	const [dailyTaskList, setDailyTaskList] = useState([]);

	const [loader, setLoader] = useState(true);

	const [socialTask, setSocialTask] = useState([]);

	const [dailyTask, setDailyTask] = useState([]);

	const [doubleBoostStart, setDoubleBosst] = useState(false);

	const [powerBoostStart, setPowerBootStart] = useState(false);

	const [twitterUserName, setTwitterUserName] = useState("");

	const [announcementReward, setAnnouncementReward] = useState([]);

	const [tonWalletAddress, setTonWalletAddress] = useState("");

	const [claimList, setClaimList] = useState([]);

	const [value, setValue] = useState({ day: 0, reward: 500 });

	const [button, setButton] = useState(false);

	// Fetch All Social Tasks from db
	const getAll = async () => {
		try {
			const response = await axios.get(`${apiUrl}/social-tasks`);
			if (response.data.status === 'success') {
				setSocialTask(response.data.socialTasks);
			}
		} catch (error) {
			console.log("Internal Server Error!")
		}
	};
	// Fetch All Daily Task from db
	const getAllDaily = async () => {
		try {
			const response = await axios.get(`${apiUrl}/daily-tasks`);
			if (response.data.status === 'success') {
				setDailyTask(response.data.dailyTasks);
			}
		} catch (error) {
			console.log("Internal Server Error!")
		}
	};

	// Daily Rewards for user
	const selection = async () => {
		try {
			if (id) {
				console.log("USERRRRRRRRRRID :", id);
				const response = await axios.get(`${apiUrl}/selection/${id}`);
				if (response.data.status === 'success') {
					setButton(response.data.button);
					setValue(response.data.value);
				}
			}
		} catch (error) {
			console.log("Internal Server Error!")
		}
	};

	useEffect(() => {
		selection();
	});

	useEffect(() => {
		let timerId;
		if (isTimerRunning && time > 0) {
			timerId = setInterval(() => {
				setTime((prevTime) => prevTime - 1);
			}, 1000);
		} else if (time === 0) {
			setTapGuru(false);
			setMainTap(true);
		}
		return () => clearInterval(timerId);
	}, [isTimerRunning, time]);

	const startTimer = useCallback(() => {
		setTime(22);
		setTapGuru(true);
		setIsTimerRunning(true);
	}, []);

	const sendUserData = async () => {
		setLoadingMain(true);
		const queryParams = new URLSearchParams(window.location.search);
		let referrerId = queryParams.get("ref");
		let isPremium = JSON.parse(queryParams.get("isPremium"));
		if (referrerId) {
			referrerId = referrerId.replace(/\D/g, "");
		}
		let telegramUser, finalUsername;
		if (staticUser === 'true') {
			telegramUser = {
				id: '03021223335',
				first_name: 'John',
				last_name: 'Doe',
				username: 'johndoe_1'
			};
			finalUsername = username || `${telegramUser.first_name}_${telegramUser.last_name}`;
		} else {
			telegramUser = tele.initDataUnsafe?.user;
			if (!telegramUser) {
				setLoading(false);
				return;
			}
			finalUsername = username || `${telegramUser.first_name}_${telegramUser.last_name}`;
			console.log("Telegram Data", telegramUser);
		}

		if (telegramUser || !staticUser === 'false') {
			try {
				const response = await axios.post(`${apiUrl}/send-user-data`, {
					queryParams: queryParams,
					referrerId,
					isPremium,
					telegramUser: telegramUser,
				})
				if (response.data.status === 'existingUser') {
					setIsUserExist(true);
					console.log("User already exists in Database");
					const userData = response.data.userData;
					console.log("User Data ================", userData);
					const filteredClaims = userData.referrals.filter(
						(referral) => !referral.status
					); //Can be removed
					setClaimList(filteredClaims);
					setBalance(userData.balance);
					setTapBalance(userData.tapBalance);
					setTapValue(userData.tapValue);
					setFreeGuru(userData.freeGuru);
					setFullTank(userData.fullTank);
					setTimeSta(userData.timeSta);
					setTimeStaTank(userData.timeStaTank);
					setClaimedMilestones(userData.claimedMilestones || []);
					setClaimedReferralRewards(userData.claimedReferralRewards || []);
					setTask(userData.task_lists || []);
					setDailyTaskList(userData.daily_task_lists || []);
					setClaimed(userData?.daily_claimed?.claimed || []);

					setUsername(userData.username);

					setBattery(userData.battery);
					setRefiller(userData.battery.energy);
					setTimeRefill(userData.timeRefill);
					setDaily_claimed(userData.daily_claimed);
					setLevel(userData.level);
					setId(userData._id);
					SetRefBonus(userData.refBonus || 0);
					setCurrentReward(userData?.double_booster?.rewardClaimed);
					setDoubleBosst(userData?.double_booster?.rewardStart);
					setPowerBootStart(userData?.power_tap?.rewardStart);
					setPowerIndex(userData?.power_tap?.rewardClaimed);
					await updateReferrals(id);
					setInitialized(true);
					setLoading(false);
					setTwitterUserName("");
					setAnnouncementReward([]);
					setTonWalletAddress("");
					fetchData(id?.toString()); // Fetch data for the existing user
					return;
				}
				else if (response.data.status === 'newUser') {
					const userData = response.data.userData;
					console.log("User Data ================", userData);
					setIsUserExist(false);
					setEnergy(500);
					setBalance(userData.balance);
					setTapBalance(userData.tapBalance);
					setTapValue(userData.tapValue);
					setFreeGuru(userData.freeGuru);
					setFullTank(userData.fullTank);
					setTimeSta(userData.timeSta);
					setTimeStaTank(userData.timeStaTank);
					setClaimedMilestones(userData.claimedMilestones || []);
					setClaimedReferralRewards(userData.claimedReferralRewards || []);
					setTask(userData.task_lists || []);
					setDailyTaskList(userData.daily_task_lists || []);
					setClaimed(userData?.daily_claimed?.claimed || []);
					setUsername(userData.username);
					setBattery(userData.battery);
					setRefiller(userData.battery.energy);
					setTimeRefill(userData.timeRefill);
					setDaily_claimed(userData.daily_claimed);
					setLevel(userData.level);
					setId(userData._id);
					SetRefBonus(userData.refBonus || 0);
					setInitialized(true);
					setLoading(false);
					fetchData(id?.toString());
					setCurrentReward(userData?.double_booster?.rewardClaimed);
					setDoubleBosst(userData?.double_booster?.rewardStart);
					setPowerBootStart(userData?.power_tap?.rewardStart);
					setPowerIndex(userData?.power_tap?.rewardClaimed);
				}
				setInitialized(true);
				setLoading(false);
				fetchData(id?.toString());
			} catch (error) {
				console.log("Internal Server Error!");
			} finally {
				setTimeout(() => {
					setLoader(false);
				}, 2000);
			}
		}
	};

	const claimRewardsOfReferals = async (referrerId, claimList) => {
		try {
			const response = await axios.post(`${apiUrl}/claim-rewards`, {
				referrerId: referrerId,
				claimList: claimList
			})
			if (response.data.status === 'success') {
				setBalance(response.data.balance);
				return { success: true };
			}
		} catch (error) {
			console.error("Error claiming rewards:", error);
			return { success: false };
		}
	};

	const [topUser, setTopUser] = useState([]);

	const [topUserWeek, setTopUserWeek] = useState([]);

	const [searchQuery, setSearchQuery] = useState("");

	const [searchWeekQuery, setSearchWeekQuery] = useState("");

	const fetchUsersDay = async (queryValue) => {
		try {
			const response = await axios.get(`${apiUrl}/fetch-users-day`, {
				params: { queryValue }
			});
			if (response.data.status === 'success') {
				setTopUser(response.data.users);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const fetchUsersWeek = async (queryValue) => {
		try {
			const response = await axios.post(`${apiUrl}/fetch-users-week`);
			if (response.data.status === 'success') {
				setTopUserWeek(response.data.users);
			} else {
				setTopUserWeek([]);
			}
		} catch (error) {
			console.log("Internal Server Error!")
		}
	};

	let [overallBalance, setOverallBalance] = useState(0); // State to hold overall user balance

	const calculateOverallBalance = async () => {
		try {
			const response = await axios.get(`${apiUrl}/calculate-overall-balance`);
			if (response.data.status === 'success') {
				setOverallBalance(response.data.totalBalance);
			}
		} catch (error) {
			console.log("Internal Server Error!")
		}
	};

	const debouncedSearch = useCallback(
		debounce((value) => {
			fetchUsersDay(value);
			fetchUsersWeek(value);
		}, 300),
		[]
	);

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchQuery(value);
		debouncedSearch(value);
	};

	const handleSearchWeekChange = (e) => {
		const value = e.target.value;
		setSearchWeekQuery(value);
		debouncedSearch(value);
	};

	useEffect(() => {
		if (!searchQuery) {
			fetchUsersDay("");
		} else if (!searchWeekQuery) {
			fetchUsersWeek("");
		}
	}, [debouncedSearch, searchQuery, searchWeekQuery]);

	const updateTwitterName = async (twitterName) => {
		try {
			const response = await axios.post(`${apiUrl}/update-twitter-name`, {
				id: id,
				twitterUserName: twitterName
			})
			if (response.data.status === 'success') {
				console.log("Twitter Name Updated!")
			}
		} catch (error) {
			console.log("Internal Server Error!");
		}
	};

	const updateAnnouncementLink = async (announceLink, status) => {
		try {
			const response = await axios.put(`${apiUrl}/update-annoucement-link/${id}`, {
				announceLink: announceLink,
				status: status
			})
			if (response.data.status === 'success') {
				console.log("Annoucement Link Updated!")
			}
		} catch (error) {
			console.log(error);
		}
	};

	const fetchAnnouncementReward = async () => {
		try {
			if (id) {
				const response = await axios.get(`${apiUrl}/fetch-announcement-reward/${id}`);
				if (response.data.status === 'success') {
					return response.data;
				} else {
					return response.data;
				}
			}
		} catch (error) {
			console.log("Internal Server Error!")
			return {
				link: "",
				status: "notVerified",
				timestamp: null,
			};
		}
	};

	useEffect(() => {
		fetchAnnouncementReward();
	}, []);

	const updateWalletAddress = async (walletAdress) => {
		try {
			const response = await axios.put(`${apiUrl}/update-wallet-address`, {
				userId: id,
				walletAddress: walletAdress
			});
			if (response.data.status === 'success') {
				console.log("Wallet Address Updated!")
			}
		} catch (error) {
			console.log(error);
		}
	};

	const updateReferrals = async (id) => {
		try {
			if (id) {
				const response = await axios.put(`${apiUrl}/update-referrals/${id}`, {
					userId: id
				});
				if (response.data.status === 'success1') {
					console.log("Wallet Address Updated!")
					return response.data;
				}
				else if (response.data.status === 'success2') {
					return response.data;
				}
				else if (response.data.status === 'success3') {
					console.log("Refferer Balance Updated!")
				}
			}
		} catch (error) {
			console.log("Internal Server Error!")
		}
	};


	// Fetch User Data with Tasks
	const fetchData = async (userId) => {
		if (!userId) return; // Ensure userId is set
		try {
			const response = await axios.get(`${apiUrl}/fetch-user-data/${userId}`);
			setCompletedTasks(response.userData.tasksCompleted || []);
			setUserManualTasks(response.userData.manualTasks || []);
			setManualTasks(response.data.manualTasks);

		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};


	const fetchReferrals = async () => {
		if (staticUser) {
			setReferrals([]);
		} else {
			const telegramUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
			if (telegramUser) {
				const { id: userId } = telegramUser;
				try {
					const response = await axios.get(`${apiUrl}/fetch-user-data/${userId}`);
					if (response.data.status === 'success') {
						setReferrals(response.data.referrals);
					}
				} catch (error) {
					console.log("Internal Server Error!");
				}
				setLoading(false);
			}
		}
	};

	const [announcement, setAnnouncement] = useState([]);

	useEffect(() => {
		const fetchAnnouncement = async () => {
			try {
				if (id) {
					const response = await axios.get(`${apiUrl}/fetch-announcement/${id}`);
					if (response.data.status === 'success') {
						setAnnouncement(response.data.announcement);
					}
				}
			} catch (error) {
				console.error("Error fetching announcement:", error);
			}
		};

		fetchAnnouncement();
	}, []);

	const updateUserLevel = async (userId, newTapBalance) => {
		try {
			const response = await axios.put(`${apiUrl}/update-user-level`, {
				userId: userId,
				newTapBalance: newTapBalance
			})
			if (response.data.status === 'success') {
				console.log("Level Update Succesfuly!")
			}
		} catch (error) {
			console.log("Internal Server Error!");
		}
	};

	useEffect(() => {
		calculateOverallBalance();
		sendUserData();
	}, []);

	const checkAndUpdateFreeGuru = async () => {
		try {
			const response = await axios.put(`${apiUrl}/check-update-free-guru`, {
				userId: id
			})
			if (response.data.success) {
				setFreeGuru(3);
			}
		} catch (error) {
			console.log("Internal Server Error!");
		}
	};

	const checkAndUpdateFullTank = async () => {
		try {
			if (id) {
				const response = await axios.put(`${apiUrl}/check-update-full-tank`, {
					id: id
				})
				if (response.data.success) {
					setFullTank(3);
				}
				else {
					setFullTank(0);
				}
			}
		} catch (error) {
			console.log("Internal Server Error!");
		}
	};

	const [timeLeft, setTimeLeft] = useState(0);
	const [startTime, setStartTime] = useState(false);

	const [powertimeLeft, setPowerTimeLeft] = useState(0);
	const [startTimePower, setStartTimePower] = useState(false);

	const fetchStartTimeTap = async (id) => {
		try {
			const response = await axios.get(`${apiUrl}/fetch-start-time-tap/${id}`);
			if (response.data.status === 'success1') {
				setStartTime(false);
				setDoubleBosst(false);
			}
			else if (response.data.status === 'success2') {
				setStartTime(response.data.startTime);
				setTimeLeft(response.data.timeLeft);
			}
			else if (response.data.status === 'success3') {
				setStartTime(false);
				setDoubleBosst(false);
			}
		} catch (error) {
			console.log("Error!");
		}
	};

	const fetchStartTimePowerTap = async (id) => {
		try {
			console.log("Fetch Poweerrr TAPPP IDD", id);
			if (id) {
				const response = await axios.get(`${apiUrl}/fetch-start-time-power-tap/${id}`);
				if (response.data.status === 'success1') {
					setStartTimePower(false);
					setPowerBootStart(false);
				}
				else if (response.data.status === 'success2') {
					setStartTimePower(response.data.startTimePower);
					setPowerTimeLeft(response.data.powerTimeLeft);
				}
				else if (response.data.status === 'success3') {
					setStartTimePower(false);
					setPowerBootStart(false);
				}
			}
		} catch (error) {
			console.log("Internal Server Error!");
		}
	};

	useEffect(() => {
		if (id) {
			fetchStartTimeTap(id);
			fetchStartTimePowerTap(id);
		}
	});

	useEffect(() => {
		if (id) {
			checkAndUpdateFreeGuru();
			checkAndUpdateFullTank();
		}
	}, [id]);

	useEffect(() => {
		if (id) {
			updateUserLevel(id, tapBalance);
		}
	}, [tapBalance, id]);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	}, []);

	useEffect(() => {
		getAll();
		getAllDaily();
		fetchReferrals();
	}, []);

	return (
		<UserContext.Provider
			value={{
				powertimeLeft,
				startTimePower,
				powerIndex,
				powerBoostStart,
				fetchStartTimeTap,
				fetchStartTimePowerTap,
				timeLeft,
				startTime,
				setStartTime,
				doubleBoostStart,
				setDoubleBosst,
				setPowerBootStart,
				powertimeLeft,
				startTimePower,
				task,
				setTask,
				dailyTaskList,
				setDailyTaskList,
				claimed,
				setClaimed,
				button,
				setButton,
				selection,
				value,
				socialTask,
				dailyTask,
				topUser,
				searchQuery,
				searchWeekQuery,
				handleSearchChange,
				handleSearchWeekChange,
				topUserWeek,
				fetchUsersDay,
				fetchUsersWeek,
				overallBalance,
				daily_claimed,
				isUserExist,
				balance,
				battery,
				freeGuru,
				fullTank,
				fetchData,
				taskCompleted,
				setTaskCompleted,
				taskCompleted2,
				setTaskCompleted2,
				rewardIndex,
				setCurrentReward,
				setPowerIndex,
				setFullTank,
				timeStaTank,
				setTimeStaTank,
				timeSta,
				setFreeGuru,
				time,
				setTime,
				startTimer,
				tapGuru,
				setTapGuru,
				mainTap,
				setMainTap,
				timeRefill,
				setTimeRefill,
				refiller,
				setRefiller,
				count,
				setCount,
				isRefilling,
				setIsRefilling,
				refillIntervalRef,
				setBattery,
				tapValue,
				setTapValue,
				tapBalance,
				setTapBalance,
				level,
				energy,
				setEnergy,
				setBalance,
				setLevel,
				loading,
				setLoading,
				id,
				setId,
				sendUserData,
				initialized,
				setInitialized,
				refBonus,
				SetRefBonus,
				manualTasks,
				setManualTasks,
				userManualTasks,
				setUserManualTasks,
				tasks,
				setTasks,
				completedTasks,
				setCompletedTasks,
				claimedMilestones,
				setClaimedMilestones,
				referrals,
				claimedReferralRewards,
				setClaimedReferralRewards,
				idme,
				setIdme,
				totalCount,
				setTotalCount,
				dividedCount,
				setDividedCount,
				users,
				setUsers,
				dividedUsers,
				setDividedUsers,
				username,
				setUsername,
				accumulatedEnergyRef,
				updateTwitterName,
				twitterUserName,
				updateWalletAddress,
				tonWalletAddress,
				loader,
				announcement,
				claimList,
				claimRewardsOfReferals,
				updateAnnouncementLink,
				announcementReward,
				fetchAnnouncementReward,
			}}>
			{children}
		</UserContext.Provider>
	);
};
