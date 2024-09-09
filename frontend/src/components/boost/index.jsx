import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "react-router-dom";
import { useUser } from "../../context";

import BoosterCard from "./boosterCard";
import BoostDailyCard from "./boosterDailyCard";
import { double, energy, kvaiCoin, power, techtap } from "../../assets";
import Footer from "../common/footer";
import { notify, notifyError } from "../../utils/notify";

const tapValues = [
	{
		level: 1,
		value: 2,
	},
	{
		level: 2,
		value: 3,
	},
	{
		level: 3,
		value: 4,
	},
	{
		level: 4,
		value: 5,
	},
	{
		level: 5,
		value: 6,
	},
	{
		level: 6,
		value: 7,
	},
	{
		level: 7,
		value: 8,
	},
	{
		level: 8,
		value: 9,
	},
	{
		level: 9,
		value: 10,
	},
	{
		level: 10,
		value: 11,
	},
	{
		level: 11,
		value: 12,
	},
	{
		level: 12,
		value: 13,
	},
	{
		level: 13,
		value: 14,
	},
];

const energyValues = [
	{
		level: 1,
		energy: 500,
	},
	{
		level: 2,
		energy: 1000,
	},
	{
		level: 3,
		energy: 1500,
	},
	{
		level: 4,
		energy: 2000,
	},
	{
		level: 5,
		energy: 2500,
	},
	{
		level: 6,
		energy: 3000,
	},
	{
		level: 7,
		energy: 3500,
	},
	{
		level: 8,
		energy: 4000,
	},
	{
		level: 9,
		energy: 4500,
	},
	{
		level: 10,
		energy: 5000,
	},
	{
		level: 11,
		energy: 5500,
	},
	{
		level: 12,
		energy: 6000,
	},
	{
		level: 13,
		energy: 6500,
	},
	{
		level: 14,
		energy: 7000,
	},
];

const chargingValues = [
	{
		level: 1,
		duration: 10,
		step: 600,
	},
	{
		level: 2,
		duration: 6,
		step: 360,
	},
	{
		level: 3,
		duration: 4,
		step: 240,
	},
	{
		level: 4,
		duration: 2,
		step: 120,
	},
	{
		level: 5,
		duration: 1,
		step: 60,
	},
];

const upgradeCosts = [
	500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000,
	1024000, 2048000,
];

const energyUpgradeCosts = [
	500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000,
	1024000, 2048000, 4096000,
];

const chargingUpgradeCosts = [0, 2000, 30000, 100000, 200000];

const Boost = () => {
	const {
		balance,
		id,
		freeGuru,
		refiller,
		setRefiller,
		setFreeGuru,
		setTapGuru,
		fullTank,
		setFullTank,
		setMainTap,
		startTimer,
		timeRefill,
		setTimeRefill,
		tapValue,
		setTapValue,
		battery,
		setEnergy,
		setBattery,
		setBalance,
		refBonus,
		sendUserData,
		loading,
		rewardIndex,
		setCurrentReward,
		setPowerIndex,
		fetchStartTimeTap,
		timeLeft,
		setStartTime,
		startTimePower,
		powertimeLeft,
		powerIndex,
		startTime,
		setPowerBootStart,
		setDoubleBosst,
		doubleBoostStart,
		powerBoostStart,
	} = useUser();
	const apiUrl = process.env.REACT_APP_API_URL;
	const [openInfo, setOpenInfo] = useState(false);
	const [openInfoTwo, setOpenInfoTwo] = useState(false);
	const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
	const [isUpgradeModalVisibleEn, setIsUpgradeModalVisibleEn] = useState(false);
	const [isUpgradeModalVisibleEnc, setIsUpgradeModalVisibleEnc] =
		useState(false);
	const [congrats, setCongrats] = useState(false);
	const [isUpgrading, setIsUpgrading] = useState(false);
	const [isUpgradingEn, setIsUpgradingEn] = useState(false);
	const [isUpgradingEnc, setIsUpgradingEnc] = useState(false);
	const [guru, setGuru] = useState(false);
	const [tank, setTank] = useState(false);
	const [bot, setBot] = useState(false);

	const [energyLimit, setEnergyLimit] = useState(false);
	const [isTaping, setTaping] = useState(false);

	const infoRef = useRef(null);
	const infoRefTwo = useRef(null);

	const handleClickOutside = (event) => {
		if (infoRef.current && !infoRef.current.contains(event.target)) {
			setOpenInfo(false);
		}
		if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
			setOpenInfoTwo(false);
		}
	};

	useEffect(() => {
		if (openInfo || openInfoTwo) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [openInfo, openInfoTwo]);

	const formatNumber = (num) => {
		if (num < 100000) {
			return new Intl.NumberFormat().format(num).replace(/,/g, " ");
		} else if (num < 1000000) {
			return new Intl.NumberFormat().format(num).replace(/,/g, " ");
		} else {
			return (num / 1000000).toFixed(3).replace(".", ".") + " M";
		}
	};

	// 1 - function to update 
	const handleUpgrade = async () => {
		setIsUpgrading(true);
		setLoading(true);

		try {
			const response = await fetch(`${apiUrl}/upgrade`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: id.toString(),
					balance,
					tapValue,
					refBonus,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setTapValue(data.newTapValue);
				setBalance(data.newBalance);
				setIsUpgrading(false);

				setTimeout(() => {
					setTaping(false);
					setLoading(false);
					notify(data.message);
				}, 1500);

				sendUserData();
			} else {
				setTimeout(() => {
					notifyError(data.message);
					setIsUpgrading(false);
					setLoading(false);
				}, 2000);
			}
		} catch (error) {
			console.error("Error during upgrade:", error);
			setTimeout(() => {
				notifyError("An error occurred during the upgrade process.");
				setIsUpgrading(false);
				setLoading(false);
			}, 2000);
		}
	};

	// 2 - function to update 
	const handleEnergyUpgrade = async () => {
		setIsUpgradingEn(true);
		setLoading(true);

		try {
			const response = await fetch(`${apiUrl}/energy-upgrade`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: id.toString(),
					balance,
					battery,
					refBonus,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				setBattery(data.newEnergyValue);
				localStorage.setItem("energy", data.newEnergyValue.energy + 500);
				setEnergy(data.newEnergyValue.energy + 500);
				setRefiller(data.newEnergyValue.energy + 500);
				setBalance(data.newBalance);
				setIsUpgradingEn(false);
				setCongrats(true);

				setTimeout(() => {
					setEnergyLimit(false);
					setLoading(false);
					notify(data.message);
				}, 1500);

				sendUserData();
			} else {
				setTimeout(() => {
					notifyError(data.message);
					setIsUpgradingEn(false);
					setLoading(false);
				}, 2000);
			}
		} catch (error) {
			console.error("Error during energy upgrade:", error);
			setTimeout(() => {
				notifyError("An error occurred during the energy upgrade process.");
				setIsUpgradingEn(false);
				setLoading(false);
			}, 2000);
		}
	};

	const nextUpgradeCost = upgradeCosts[tapValue.level];
	const hasSufficientBalance = balance + refBonus >= nextUpgradeCost;

	const nextEnergyUpgradeCost = energyUpgradeCosts[battery.level];
	const hasSufficientBalanceEn = balance + refBonus >= nextEnergyUpgradeCost;

	const [isLoading, setLoading] = useState(false);
	const [isLoadingPower, setLoadingPower] = useState(false);

	const calculateTimeRemaining = () => {
		const now = new Date();
		const nextDate = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + 1
		);
		const timeDiff = nextDate - now;

		const hours = Math.floor(timeDiff / (1000 * 60 * 60));
		const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

		return { hours, minutes, seconds };
	};
	const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeRemaining(calculateTimeRemaining());
		}, 1000);

		return () => clearInterval(interval); // Clear interval on component unmountxxxxxxxxxxxxxxx
	}, []);
	const navigation = useNavigation();


	// 3 - function to update 
	const fetchStartTime = async () => {
		try {
			const response = await fetch(`${apiUrl}/fetch-start-time`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId: id.toString() }),
			});

			const data = await response.json();

			if (response.ok) {
				if (data.message === 'Double booster expired and reset successfully.') {
					setCurrentReward(data.currentReward);
				}
				// Handle other cases as needed
			} else {
				console.error('Error:', data.message);
			}
		} catch (error) {
			console.error('Error during fetching start time:', error);
		}
	};

	// 4 - function to update 
	const fetchStartTimePowerTap = async () => {
		try {
			const response = await fetch(`${apiUrl}/fetch-start-time-power-tap`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId: id.toString() }),
			});

			const data = await response.json();

			if (response.ok) {
				if (data.message === 'Power tap expired and reset successfully.') {
					setPowerIndex(data.newPowerIndex);
				}
				// Handle other cases as needed
			} else {
				console.error('Error:', data.message);
			}
		} catch (error) {
			console.error('Error during fetching power tap start time:', error);
		}
	};

	useEffect(() => {
		fetchStartTime();
		fetchStartTimePowerTap();
	}, []);

	useEffect(() => {
		if (id) {
			fetchStartTimeTap(id);
		}
	});

	const check1hour = (date) => {
		if (!date?.toDate()) return false;
		const now = new Date();
		const lastClaimedDate = date.toDate();
		return now - lastClaimedDate >= 1 * 60 * 1000;
	};


	// 5 - function to update 
	const handlePowerTap = async () => {
		if (doubleBoostStart) {
			notifyError(`One booster already enabled`);
			return;
		}

		setLoadingPower(true);

		try {
			const response = await fetch(`${apiUrl}/handle-power-tap`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId: id.toString() }),
			});

			const data = await response.json();

			if (response.ok) {
				if (data.message === 'You can tap unlimited times for 1 minute') {
					setPowerBootStart(true);
					setPowerIndex(data.newPowerIndex);
					fetchStartTimePowerTap(id);
					notify(data.message);
					setTimeout(() => {
						setPowerTap(false);
					}, 1000);
				} else {
					notifyError(data.message);
				}
			} else {
				console.error('Error:', data.message);
			}
		} catch (error) {
			console.error('Error during power tap handling:', error);
		} finally {
			setTimeout(() => {
				setLoadingPower(false);
			}, 1000);
		}
	};

	// 6 - function to update 
	const handleSetIndexClick = async () => {
		if (powerBoostStart) {
			notifyError('One booster already enabled');
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${apiUrl}/handle-set-index`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId: id.toString() }),
			});

			const data = await response.json();

			if (response.ok) {
				if (data.message === 'You can tap unlimited times for 1 minute') {
					setDoubleBosst(true);
					setCurrentReward(data.newRewardClaimed);
					fetchStartTimeTap(id);
					notify(data.message);
					setTimeout(() => {
						setDoubleBooster(false);
					}, 1000);
				} else {
					notifyError(data.message);
				}
			} else {
				console.error('Error:', data.message);
			}
		} catch (error) {
			console.error('Error during handle set index click:', error);
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	};

	const [powerTap, setPowerTap] = useState(false);
	const [doubleBooster, setDoubleBooster] = useState(false);
	const [timer1, setTimer1] = useState();
	const [timer2, setTimer2] = useState();

	return (
		<>
			<div className="w-full  text-white flex flex-col items-center gap-6 font-sans bg-[url('/src/assets/MainBackground.png')] overflow-x-hidden min-h-screen pt-5 px-3 bg-cover  ">
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
					<h1 className='text-4xl font-bold'>{balance + refBonus}</h1>
				</div>
				<div className=' w-full'>
					<hr />
				</div>
				<div className='mx-[20px] w-full flex flex-col gap-4 my-2  overflow-y-auto pb-20'>
					<h6 className='font-bold text-[14px]'>Boost Daily</h6>
					<BoostDailyCard
						img={power}
						title='Power Tap'
						desc='5X taps for 60 Secs (Refreshes in every 24 Hours)'
						no={`${powerIndex}/3`}
						time={powertimeLeft}
						startTime={startTimePower}
						onClick={() => {
							setPowerTap(!powerTap);
						}}
					/>
					<BoostDailyCard
						img={double}
						title='Double Boosters'
						desc='2X The Gains'
						no={`${rewardIndex}/3`}
						time={timeLeft}
						startTime={startTime}
						onClick={() => {
							setDoubleBooster(!doubleBooster);
						}}
					/>
					<div className='max-h-[270px] overflow-y-auto flex flex-col gap-4 '>
						<h6 className='font-bold text-[14px]'>Boosters</h6>
						<BoosterCard
							img={techtap}
							title='Multi Taps'
							desc='Auto Taps (1000 Per Second) | Just Single Touch'
							amount={nextUpgradeCost}
							onClick={() => setTaping(!isTaping)}
						/>
						<BoosterCard
							onClick={() => setEnergyLimit(!energyLimit)}
							img={energy}
							title='Energy Limit'
							desc='100,000 Energy'
							amount={nextEnergyUpgradeCost}
						/>
					</div>
				</div>

				<div>
					<Footer
						fixed={true}
						currentPage={1}
					/>
				</div>
			</div>
			<div
				className={`${powerTap ? "visible" : "invisible"
					} h-[100vh] absolute bottom-0 left-0 right-0 bg-[#000000B2]`}>
				<div
					className={` fixed bottom-0 left-0 right-0 h-fit modal_background  z-50 backdrop-blur-sm  border-t-[3px] border-[#A51CF5] rounded-tl-[20px] rounded-tr-[20px] flex justify-center container-1 pb-[12px] pt-[51px] text-white bg-[#0A031880]`}>
					<div className='w-full flex flex-col justify-between'>
						<button
							onClick={() => setPowerTap(false)}
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

						<div className='w-full  text-center'>
							<img
								alt='claim'
								src={power}
								className='w-[100px] mx-auto'
							/>
							<div className='flex flex-col gap-y-[7px]'>
								<h3 className=' text-[32px]'>Power Tap</h3>

								<p className='text-[16px] mx-auto'>
									Incease the maximum energy capacity
									<br /> (+5 per tap)
								</p>
							</div>
						</div>
						<div className='flex justify-center items-center gap-x-[4px] mt-[23px]'></div>
						<button
							onClick={handlePowerTap}
							disabled={!hasSufficientBalanceEn || isLoading}
							className=' invite-friend-button py-[10px] px-[4px] w-full border border-[#A51CF5] rounded-full mt-[14px] text-[16px] text-white bg-[#0A0318] bg-gradient-to-l from-[#35107E]'>
							{isLoadingPower
								? "Boosting..."
								: hasSufficientBalanceEn
									? "Boost Now!"
									: "Insufficient Balance"}
						</button>
					</div>
				</div>
			</div>
			<div
				className={`${doubleBooster ? "visible" : "invisible"
					} h-[100vh] absolute bottom-0 left-0 right-0 bg-[#000000B2]`}>
				<div
					className={` fixed bottom-0 left-0 right-0 h-fit modal_background  z-50 backdrop-blur-sm  border-t-[3px] border-[#A51CF5] rounded-tl-[20px] rounded-tr-[20px] flex justify-center container-1 pb-[12px] pt-[51px] text-white bg-[#0A031880]`}>
					<div className='w-full flex flex-col justify-between'>
						<button
							onClick={() => setDoubleBooster(false)}
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

						<div className='w-full text-center'>
							<img
								alt='claim'
								src={double}
								className='w-[100px] mx-auto'
							/>
							<div className='flex flex-col gap-y-[7px]'>
								<h3 className=' text-[32px]'>Double Booster</h3>

								<p className='text-[16px] mx-auto'>
									Incease the maximum energy capacity
									<br /> (x2 per tap)
								</p>
							</div>
						</div>
						<div className='flex justify-center items-center gap-x-[4px] mt-[23px]'></div>
						<button
							onClick={handleSetIndexClick}
							disabled={!hasSufficientBalanceEn || isLoading}
							className=' invite-friend-button py-[10px] px-[4px] w-full border border-[#A51CF5]  rounded-full mt-[14px] text-[16px] text-white bg-[#0A0318] bg-gradient-to-l from-[#35107E]'>
							{isLoading
								? "Boosting..."
								: hasSufficientBalanceEn
									? "Boost Now!"
									: "Insufficient Balance"}
						</button>
					</div>
				</div>
			</div>
			<div
				className={`${energyLimit ? "visible" : "invisible"
					} h-[100vh] absolute bottom-0 left-0 right-0 bg-[#000000B2]`}>
				<div
					className={` fixed bottom-0 left-0 right-0 h-fit modal_background  z-50 backdrop-blur-sm  border-t-[3px] border-[#A51CF5]  rounded-tl-[20px] rounded-tr-[20px] flex justify-center container-1 pb-[12px] pt-[51px] bg-[#0A031880]`}>
					<div className='w-full flex flex-col justify-between'>
						<button
							onClick={() => setEnergyLimit(false)}
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

						<div className='w-full  text-center'>
							<img
								alt='claim'
								src={energy}
								className='w-[100px] mx-auto'
							/>
							<div className='flex flex-col gap-y-[7px] text-[#FFFFFFCC]'>
								<h3 className=' text-[32px] text-white '>Energy Limit</h3>

								<p className='text-[16px]  mx-auto '>
									Incease the maximum energy capacity
									<br /> (+500 per level)
								</p>
								<p className='text-[16px]'>
									Level
									{energyValues[battery.level]?.level
										? energyValues[battery.level]?.level
										: "Max"}
								</p>
							</div>
						</div>

						<div className='flex justify-center items-center gap-x-[4px] mt-[23px]'>
							<img
								src={kvaiCoin}
								className='w-[25px] '></img>
							<p className='text-white   text-[20px]'>
								{!nextEnergyUpgradeCost
									? "Max Level Reached"
									: nextEnergyUpgradeCost}
							</p>
						</div>

						<button
							onClick={handleEnergyUpgrade}
							disabled={!hasSufficientBalanceEn || isLoading}
							className=' invite-friend-button  border border-[#A51CF5] py-[10px] px-[4px] w-full  rounded-full mt-[14px] text-[16px] text-white bg-[#0A0318] bg-gradient-to-l from-[#35107E] '>
							{!nextEnergyUpgradeCost
								? "Max Level Reached"
								: isLoading
									? "Boosting..."
									: hasSufficientBalanceEn
										? "Get it!"
										: "Insufficient Balance"}
						</button>
					</div>
				</div>
			</div>
			<div
				className={`${isTaping ? "visible" : "invisible"
					} h-[100vh] absolute bottom-0 left-0 right-0 bg-[#000000B2]`}>
				<div
					className={` fixed bottom-0 left-0 right-0 h-fit modal_background  z-50 backdrop-blur-sm  border-t-[3px] border-[#A51CF5]  rounded-tl-[20px] rounded-tr-[20px] flex justify-center container-1 pb-[12px] pt-[51px] bg-[#0A031880]`}>
					<div className='w-full flex flex-col justify-between'>
						<button
							onClick={() => setTaping(false)}
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

						<div className='w-full  text-center'>
							<img
								alt='claim'
								src={techtap}
								className='w-[100px] mx-auto'
							/>
							<div className='flex flex-col gap-y-[7px] text-[#FFFFFFCC]'>
								<h3 className=' text-[32px] text-white '>Multitap</h3>

								<p className='text-[16px]  mx-auto '>
									Increase the amount of TAP earned per tap <br /> (+1 per
									level)
								</p>
								<p className='text-[16px]'>
									Level{" "}
									{tapValues[tapValue.level]?.level
										? tapValues[tapValue.level]?.level
										: "Max"}
								</p>
							</div>
						</div>

						<div className='flex justify-center items-center gap-x-[4px] mt-[25px]'>
							<img
								src={kvaiCoin}
								className='w-[25px] '></img>
							<p className='text-white   text-[20px]'>
								{!nextUpgradeCost ? "Max Level Reached" : nextUpgradeCost}
							</p>
						</div>

						<button
							onClick={handleUpgrade}
							disabled={!hasSufficientBalance || isLoading}
							className=' invite-friend-button  border border-[#A51CF5] py-[10px] px-[4px] w-full  rounded-full mt-[14px] text-[16px] text-white bg-[#0A0318] bg-gradient-to-l from-[#35107E]'>
							{!nextUpgradeCost
								? "Max Level Reached"
								: isLoading
									? "Boosting..."
									: hasSufficientBalance
										? "Get it!"
										: "Insufficient Balance"}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Boost;
