import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	useCallback,
} from "react";
import {
	doc,
	getDoc,
	setDoc,
	updateDoc,
	arrayUnion,
	getDocs,
	collection,
	serverTimestamp,
	Timestamp,
	query,
	orderBy,
	limit,
	where,
	Firestore,
} from "firebase/firestore";
import { db } from "../config/firebase"; // Adjust the path as needed
import { debounce } from "../utils/debounce";
import { telegram } from "../assets";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
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
	const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
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

	const getAll = async () => {
		const querySnapshot = await getDocs(collection(db, "socialTask"));
		const eventsArray = [];

		querySnapshot.forEach((doc) => {
			eventsArray.push({ id: doc.id, ...doc.data() });
		});

		setSocialTask(eventsArray);
	};

	const getAllDaily = async () => {
		const querySnapshot = await getDocs(collection(db, "dailyTask"));
		const eventsArray = [];

		querySnapshot.forEach((doc) => {
			eventsArray.push({ id: doc.id, ...doc.data() });
		});

		setDailyTask(eventsArray);
	};

	const [value, setValue] = useState({ day: 0, reward: 500 });

	const check48Hour = (date) => {
		const now = new Date();
		const lastClaimedDate = date.toDate();
		if (!lastClaimedDate) {
			return true;
		}

		// const twoDays = 48 * 60 * 60 * 1000;
		const twoDays = 10 * 60 * 1000;
		return now - lastClaimedDate >= twoDays;
	};

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

	const [button, setButton] = useState(false);

	const selection = async () => {
		const userRef = doc(db, "telegramUsers", id.toString());

		const userDoc = await getDoc(userRef);
		if (userDoc.exists()) {
			let data = userDoc.data();
			let { day, date } = data?.daily_claimed;

			if (date !== "") {
				setButton(true);

				if (check48Hour(date)) {
					setValue({ day: 0, reward: 500 });
					setClaimed([]);

					await updateDoc(userRef, {
						daily_claimed: {
							claimed: [],
							day: "",
							reward: 0,
							date: "",
						},
					});
					setButton(false);
				} else {
					if (check24hour(date)) {
						setButton(false);

						if (day === 0) {
							return setValue({ day: 1, reward: 1000 });
						} else if (day === 1) {
							return setValue({ day: 2, reward: 2000 });
						} else if (day == 2) {
							return setValue({ day: 3, reward: 5000 });
						} else if (day === 3) {
							return setValue({ day: 4, reward: 10000 });
						} else if (day === 4) {
							return setValue({ day: 5, reward: 25000 });
						} else if (day === 5) {
							return setValue({ day: 6, reward: 50000 });
						} else {
							setValue({ day: 0, reward: 500 });
							setClaimed([]);
							await updateDoc(userRef, {
								daily_claimed: {
									claimed: [],
									day: "",
									reward: 0,
									date: "",
								},
							});
						}
					} else {
						setButton(true);
						return setValue(data.daily_claimed);
					}
				}
			} else {
				setButton(false);

				setValue({ day: 0, reward: 500 });
			}
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

		if (telegramUser) {
			// const telegramUser = {
			// 	id: 7346376317,
			// 	username: "alpha_abdullah7",
			// 	first_name: "Muhammad",
			// 	last_name: "Abdullah",
			// };
			const {
				id: userId,
				username,
				first_name: firstName,
				last_name: lastName,
			} = telegramUser;
			const finalUsername = username || `${firstName}_${lastName}`;
			try {
				const userRef = doc(db, "telegramUsers", userId?.toString());
				const userDoc = await getDoc(userRef);
				if (userDoc.exists()) {
					setIsUserExist(true);
					console.log("User already exists in Firestore");
					const userData = userDoc.data();
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
					setId(userData.userId);
					SetRefBonus(userData.refBonus || 0);
					setCurrentReward(userData?.double_booster?.rewardClaimed);
					setDoubleBosst(userData?.double_booster?.rewardStart);
					setPowerBootStart(userData?.power_tap?.rewardStart);
					setPowerIndex(userData?.power_tap?.rewardClaimed);
					await updateReferrals(userRef);
					setInitialized(true);
					setLoading(false);
					setTwitterUserName("");
					setAnnouncementReward([]);
					setTonWalletAddress("");
					fetchData(userId?.toString()); // Fetch data for the existing user

					return;
				}
				setIsUserExist(false);

				const userData = referrerId
					? {
							userId: userId.toString(),
							username: finalUsername,
							firstName,
							lastName,
							totalBalance: 0,
							balance: isPremium ? 25000 : 10000,
							freeGuru: 3,
							fullTank: 3,
							tapBalance: 0,
							timeSta: null,
							timeStaTank: null,
							daily_claimed: {
								claimed: [],
								day: 0,
								date: "",
								reward: 0,
							},
							claimedReferralRewards: [],
							tapValue: { level: 0, value: 1 },
							timeRefill: { level: 1, duration: 10, step: 600 },
							level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" }, // Set the initial level with id and name
							energy: 500,
							battery: { level: 1, energy: 500 },
							refereeId: referrerId || null,
							referrals: [],
							double_booster: {
								startAt: "",
								rewardTimer: "",
								rewardClaimed: 0,
								rewardStart: false,
							},
							power_tap: {
								startAt: "",
								rewardTimer: "",
								rewardClaimed: 0,
								rewardStart: false,
							},
							announcementReward: {
								link: "",
								status: "notVerified",
								timestamp: null,
							},
							task_lists: [],
							daily_task_lists: [],
							youtube_booster: {
								date: "",
								startAt: "",
								status: false,
								rewardIndex: 0,
								videoWatch: 0,
							},
							twitterUserName: "",
							tonWalletAddress: "",
							createdAt: serverTimestamp(),
					  }
					: {
							userId: userId.toString(),
							username: finalUsername,
							firstName,
							lastName,
							totalBalance: 0,
							balance: 0,
							freeGuru: 3,
							fullTank: 3,
							tapBalance: 0,
							timeSta: null,
							timeStaTank: null,
							daily_claimed: {
								claimed: [],
								day: 0,
								date: "",
								reward: 0,
							},
							claimedReferralRewards: [],
							double_booster: {
								startedAt: "",
								rewardTimer: "",
								rewardClaimed: 0,
								rewardStart: false,
							},
							power_tap: {
								startedAt: "",
								rewardTimer: "",
								rewardClaimed: 0,
								rewardStart: false,
							},
							announcementReward: {
								link: "",
								status: "notVerified",
								timestamp: null,
							},
							tapValue: { level: 0, value: 1 },
							timeRefill: { level: 1, duration: 10, step: 600 },
							level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" }, // Set the initial level with id and name
							energy: 500,
							battery: { level: 0, energy: 500 },
							refereeId: referrerId || null,
							referrals: [],
							task_lists: [],
							daily_task_lists: [],
							youtube_booster: {
								date: "",
								startAt: "",
								status: false,
								rewardIndex: 0,
								videoWatch: 0,
							},
							twitterUserName: "",
							tonWalletAddress: "",
							createdAt: serverTimestamp(),
					  };
				await setDoc(userRef, userData);
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
				setId(userData.userId);
				SetRefBonus(userData.refBonus || 0);
				setInitialized(true);
				setLoading(false);
				fetchData(userId?.toString());
				setCurrentReward(userData?.double_booster?.rewardClaimed);
				setDoubleBosst(userData?.double_booster?.rewardStart);
				setPowerBootStart(userData?.power_tap?.rewardStart);
				setPowerIndex(userData?.power_tap?.rewardClaimed);

				if (referrerId) {
					const referrerRef = doc(db, "telegramUsers", referrerId);
					const referrerDoc = await getDoc(referrerRef);
					if (referrerDoc.exists()) {
						// let { balance } = referrerDoc.data();
						await updateDoc(referrerRef, {
							// balance: isPremium ? balance + 25000 : balance + 10000,
							referrals: arrayUnion({
								userId: userId.toString(),
								username: finalUsername,
								balance: userData.balance,
								status: false,
								isPremium: isPremium ? true : false,
								level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" }, // Include level with id and name
							}),
						});
						const updatedReferrerDoc = await getDoc(userData.id);
						if (updatedReferrerDoc.exists()) {
							const updatedBalance = updatedReferrerDoc.data().balance;
							setBalance(updatedBalance); // Make sure setReferrerBalance is defined in your state
						}
					}
				}
				setInitialized(true);
				setLoading(false);
				fetchData(userId?.toString());
			} catch (error) {
				console.error("Error saving user in Firestore:", error);
			} finally {
				setTimeout(() => {
					setLoader(false);
				}, 2000);
			}
		}
	};

	const claimRewardsOfReferals = async (referrerId, claimList) => {
		try {
			let totalReward = 0;
			// Calculate the total reward
			claimList.forEach((claim) => {
				totalReward += claim.isPremium ? 25000 : 10000;
			});
			const referrerRef = doc(db, "telegramUsers", referrerId);
			const referrerDoc = await getDoc(referrerRef);
			if (referrerDoc.exists()) {
				// Update the balance
				const currentBalance = referrerDoc.data().balance || 0;
				const newBalance = currentBalance + totalReward;
				await updateDoc(referrerRef, {
					balance: newBalance,
				});
				setBalance(newBalance);
				// Update the status of each object in claimList
				const updatedClaimList = claimList.map((claim) => {
					if (!claim.status) {
						claim.status = true; // Change status to true
					}
					return claim;
				});
				// Update the referrer document with the updated claim list
				await updateDoc(referrerRef, {
					referrals: updatedClaimList,
				});
			}
			return { success: true };
		} catch (error) {
			console.error("Error claiming rewards:", error);
			return { success: false };
		}
	};
	// const fetchStartTimeTap = async () => {

	//   // const userRef = doc(db, "telegramUsers", "7326264229");
	//   const userRef = doc(db, 'telegramUsers', id.toString());

	//   console.log("timer true")
	//   const userDoc = await getDoc(userRef);
	//   if (userDoc.exists()) {
	//     const data = userDoc.data();
	//     if (data?.youtube_booster?.date) {
	//       const startTime = data.youtube_booster.date.toDate();
	//       const currentTime = Date.now();
	//       const timePassed = currentTime - startTime;
	//       const oneHourInMillis = 1 * 60 * 60 * 1000;

	//       if (timePassed >= oneHourInMillis) {
	//         setStartTapTime(false);
	//         console.log("timer false")
	//       } else {
	//         const remainingTime = oneHourInMillis - timePassed;
	//         setTapTimer(Math.floor(remainingTime / 1000)); // Convert to seconds
	//         setStartTapTime(true);
	//         console.log("timer true")
	//       }
	//     }
	//   }
	// };

	// useEffect(() => {
	//   fetchStartTimeTap()
	// }, [])

	const [topUser, setTopUser] = useState([]);
	const [topUserWeek, setTopUserWeek] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchWeekQuery, setSearchWeekQuery] = useState("");

	const fetchUsersDay = async (queryValue) => {
		try {
			let firstQuery;

			if (queryValue) {
				firstQuery = query(
					collection(db, "telegramUsers"),
					where("username", ">=", queryValue),
					where("username", "<=", queryValue + "\uf8ff"),
					orderBy("balance", "desc"),
					limit(100)
				);
			} else {
				firstQuery = query(
					collection(db, "telegramUsers"),
					orderBy("balance", "desc"),
					limit(100)
				);
			}

			const res = await getDocs(firstQuery);

			const data = res.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setTopUser(data);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchUsersWeek = async (queryValue) => {
		try {
			let firstQuery;

			if (queryValue) {
				console.log(queryValue);
				firstQuery = query(
					collection(db, "telegramUsers"),
					where("username", ">=", queryValue),
					where("username", "<=", queryValue + "\uf8ff"),
					orderBy("balance", "desc")
				);
			} else {
				firstQuery = query(
					collection(db, "telegramUsers"),
					orderBy("balance", "desc")
				);
			}

			const res = await getDocs(firstQuery);

			const data = res.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setTopUserWeek(data);
		} catch (error) {}
	};

	let [overallBalance, setOverallBalance] = useState(0); // State to hold overall user balance

	const calculateOverallBalance = async () => {
		const overallQuery = query(collection(db, "telegramUsers"));
		const res = await getDocs(overallQuery);

		// Log all documents to see their data
		res.docs.forEach((doc) => {
			console.log(`Document ID: ${doc.id}`, doc.data());
		});

		// Safely extract the balance field and sum it up
		const totalBalance = res.docs.reduce((sum, doc) => {
			const data = doc.data();
			const balance = data.balance;
			console.log(`Balance for document ${doc.id}:`, balance, sum); // Debug log
			return sum + (balance || 0); // Add balance to sum or 0 if undefined
		}, 0);

		console.log("Total Balance:", totalBalance); // Log the total balance
		setOverallBalance(totalBalance);
		console.log("Total Balance2:", totalBalance); // Log the total balance
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
			await updateDoc(doc(db, "telegramUsers", id), {
				twitterUserName: twitterName,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const updateAnnouncementLink = async (announceLink, status) => {
		try {
			await updateDoc(doc(db, "telegramUsers", id), {
				announcementReward: {
					link: announceLink,
					status: status,
					timestamp: serverTimestamp(),
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	// const check1min = (date) => {
	// 	const now = new Date();
	// 	const lastClaimedDate = date.toDate();
	// 	if (!lastClaimedDate) {
	// 		return true;
	// 	}

	// 	const oneDay = 60 * 1000;
	// 	return now - lastClaimedDate >= oneDay;
	// };

	const fetchAnnouncementReward = async () => {
		try {
			const docRef = doc(db, "telegramUsers", id);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const rewardData = docSnap.data().announcementReward || {
					link: "",
					status: "notVerified",
					timestamp: null,
				};

				if (check24hour(rewardData.timestamp)) {
					await updateDoc(docRef, {
						announcementReward: {
							link: "",
							status: "notVerified",
							timestamp: null,
						},
					});
					return {
						link: "",
						status: "notVerified",
						timestamp: null,
					};
				} else {
					return rewardData;
				}
			} else {
				return {
					link: "",
					status: "notVerified",
					timestamp: null,
				};
			}
		} catch (error) {
			console.error("Error fetching announcement reward:", error);
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
			await updateDoc(doc(db, "telegramUsers", id), {
				tonWalletAddress: walletAdress,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const updateReferrals = async (userRef) => {
		const userDoc = await getDoc(userRef);
		const userData = userDoc.data();
		const referrals = userData.referrals || [];

		const updatedReferrals = await Promise.all(
			referrals.map(async (referral) => {
				const referralRef = doc(db, "telegramUsers", referral?.userId);
				const referralDoc = await getDoc(referralRef);
				if (referralDoc.exists()) {
					const referralData = referralDoc.data();
					return {
						...referral,
						balance: referralData.balance,
						level: referralData.level,
					};
				}
				return referral;
			})
		);

		await updateDoc(userRef, {
			referrals: updatedReferrals,
		});

		const totalEarnings = updatedReferrals.reduce(
			(acc, curr) => acc + curr.balance,
			0
		);
		const refBonus = Math.floor(totalEarnings * 0.1);
		const totalBalance = `${balance}` + refBonus;
		try {
			await updateDoc(userRef, { refBonus, totalBalance });
			console.log("Referrer bonus updated in Firestore");
			console.log("Your balance is:", `${balance}`);
		} catch (error) {
			console.error("Error updating referrer bonus:", error);
		}
	};

	const fetchData = async (userId) => {
		if (!userId) return; // Ensure userId is set
		try {
			// Fetch tasks
			const tasksQuerySnapshot = await getDocs(collection(db, "tasks"));
			const tasksData = tasksQuerySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setTasks(tasksData);

			const userDocRef = doc(db, "telegramUsers", userId);
			const userDoc = await getDoc(userDocRef);
			if (userDoc.exists()) {
				const userData = userDoc.data();
				setCompletedTasks(userData.tasksCompleted || []);
				setUserManualTasks(userData.manualTasks || []);
			}
			const manualTasksQuerySnapshot = await getDocs(
				collection(db, "manualTasks")
			);
			const manualTasksData = manualTasksQuerySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setManualTasks(manualTasksData);
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	const fetchReferrals = async () => {
		const telegramUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
		if (telegramUser) {
			const { id: userId } = telegramUser;
			const userRef = doc(db, "telegramUsers", userId?.toString());
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				const userData = userDoc.data();
				setReferrals(userData.referrals || []);
			}
			setLoading(false);
		}
	};

	const [announcement, setAnnouncement] = useState([]);

	useEffect(() => {
		const fetchAnnouncement = async () => {
			try {
				const tasksRef = collection(db, "announcements");
				const q = query(tasksRef, where("status", "==", true));
				const snapshot = await getDocs(q);

				if (snapshot.empty) {
					console.log("No announcements found with status true!");
					return;
				}

				const doc = snapshot.docs[0];
				const announcementData = { id: doc.id, ...doc.data() };
				setAnnouncement(announcementData);
			} catch (error) {
				console.error("Error fetching announcement:", error);
			}
		};

		fetchAnnouncement();
	}, []);

	const updateUserLevel = async (userId, newTapBalance) => {
		let newLevel = { id: 1, name: "Bronze", imgUrl: "/bronze.webp" };

		if (newTapBalance >= 1000 && newTapBalance < 50000) {
			newLevel = { id: 2, name: "Silver", imgUrl: "/sliver.webp" };
		} else if (newTapBalance >= 50000 && newTapBalance < 500000) {
			newLevel = { id: 3, name: "Gold", imgUrl: "/gold.webp" };
		} else if (newTapBalance >= 500000 && newTapBalance < 1000000) {
			newLevel = { id: 4, name: "Platinum", imgUrl: "/platinum.webp" };
		} else if (newTapBalance >= 1000000 && newTapBalance < 2500000) {
			newLevel = { id: 5, name: "Diamond", imgUrl: "/diamond.webp" };
		} else if (newTapBalance >= 2500000) {
			newLevel = { id: 6, name: "Master", imgUrl: "/master.webp" };
		}

		if (newLevel.id !== level.id) {
			setLevel(newLevel);
			const userRef = doc(db, "telegramUsers", userId);
			await updateDoc(userRef, { level: newLevel });
			console.log(`User level updated to ${newLevel.name}`);
		}
	};

	useEffect(() => {
		calculateOverallBalance();
		sendUserData();
	}, []);

	const checkAndUpdateFreeGuru = async () => {
		const userRef = doc(db, "telegramUsers", id?.toString());
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			const lastDate = userData.timeSta.toDate(); // Convert Firestore timestamp to JS Date
			const formattedDates = lastDate.toISOString().split("T")[0]; // Get the date part in YYYY-MM-DD format
			const currentDate = new Date(); // Get the current date
			const formattedCurrentDates = currentDate.toISOString().split("T")[0]; // Get the date part in YYYY-MM-DD format

			if (formattedDates !== formattedCurrentDates && userData.freeGuru <= 0) {
				await updateDoc(userRef, {
					freeGuru: 3,
					timeSta: new Date(),
				});
				setFreeGuru(3);
			}
		}
	};

	const checkAndUpdateFullTank = async () => {
		const userRef = doc(db, "telegramUsers", id?.toString());
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();
			const lastDateTank = userData.timeStaTank.toDate(); // Convert Firestore timestamp to JS Date
			const formattedDate = lastDateTank.toISOString().split("T")[0]; // Get the date part in YYYY-MM-DD format
			const currentDate = new Date(); // Get the current date
			const formattedCurrentDate = currentDate.toISOString().split("T")[0]; // Get the date part in YYYY-MM-DD format

			if (formattedDate !== formattedCurrentDate && userData.fullTank <= 0) {
				await updateDoc(userRef, {
					fullTank: 3,
					timeStaTank: new Date(),
				});
				setFullTank(3);
			}
		}
	};

	const [timeLeft, setTimeLeft] = useState(0);
	const [startTime, setStartTime] = useState(false);

	const [powertimeLeft, setPowerTimeLeft] = useState(0);
	const [startTimePower, setStartTimePower] = useState(false);

	const fetchStartTimeTap = async (id) => {
		const userRef = doc(db, "telegramUsers", id.toString());

		const userDoc = await getDoc(userRef);
		if (userDoc.exists()) {
			const data = userDoc.data();
			if (data?.double_booster?.rewardTimer) {
				const startTime = data.double_booster.rewardTimer.toDate();
				const currentTime = Date.now();
				const timePassed = currentTime - startTime;
				const oneHourInMillis = 1 * 60 * 1000;

				if (timePassed >= oneHourInMillis) {
					setStartTime(false);
					setDoubleBosst(false);
				} else {
					setStartTime(true);
					const remainingTime = oneHourInMillis - timePassed;
					setTimeLeft(Math.floor(remainingTime / 1000));
				}
			}
		}
	};

	const fetchStartTimePowerTap = async (id) => {
		const userRef = doc(db, "telegramUsers", id.toString());

		const userDoc = await getDoc(userRef);
		if (userDoc.exists()) {
			const data = userDoc.data();
			if (data?.power_tap?.rewardTimer) {
				const startTime = data.power_tap.rewardTimer.toDate();
				const currentTime = Date.now();
				const timePassed = currentTime - startTime;
				const oneHourInMillis = 1 * 60 * 1000;

				if (timePassed >= oneHourInMillis) {
					setStartTimePower(false);
					setPowerBootStart(false);
				} else {
					setStartTimePower(true);
					const remainingTime = oneHourInMillis - timePassed;
					setPowerTimeLeft(Math.floor(remainingTime / 1000));
				}
			}
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
