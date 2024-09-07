import { useEffect, useRef, useState } from "react";

import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "../../config/firebase";
import { useUser } from "../../context";
import { add, award, kvaiCoin, robot, shadow, star } from "../../assets";
import Footer from "../common/footer";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import Loader from "../common/loader";
import Notification from "../notification";
import { notify, notifyError } from "../../utils/notify";

const tele = window.Telegram.WebApp;
tele.disableVerticalSwipes();

const slideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-350px);
  }
`;

const SlideUpText = styled.div`
	position: absolute;
	animation: ${slideUp} 3s ease-out;
	font-size: 2.1em;
	color: #ffffffa6;
	font-weight: 600;
	left: ${({ x }) => x}px;
	top: ${({ y }) => y}px;
	pointer-events: none; /* To prevent any interaction */
`;

const Container = styled.div`
	position: relative;
	display: inline-block;
	text-align: center;
	width: 100%;
	height: 100%;
`;

const Home = () => {
	const imageRef = useRef(null);
	const [clicks, setClicks] = useState([]);
	const {
		id,
		refiller,
		sendUserData,
		balance,
		tapBalance,
		energy,
		battery,
		tapGuru,
		mainTap,
		setIsRefilling,
		isRefilling,
		refillIntervalRef,
		setEnergy,
		tapValue,
		setTapBalance,
		setBalance,
		accumulatedEnergyRef,
		username,
		loader,
		doubleBoostStart,
		powerBoostStart,
		claimList,
		claimRewardsOfReferals,
	} = useUser();
	const [isDisabled, setIsDisabled] = useState(false);
	const [claimListHere, setClaimListHere] = useState(claimList);
	const [points, setPoints] = useState(0);
	const debounceTimerRef = useRef(null);
	const debounceButton = useRef(null);
	const isUpdatingRef = useRef(false);
	const accumulatedBalanceRef = useRef(balance);
	const accumulatedTapBalanceRef = useRef(tapBalance);
	const refillTimeoutRef = useRef(null);
	const [glowBooster, setGlowBooster] = useState(false);
	const refillDuration = 800;
	const incrementValue = 1;
	const defaultEnergy = 0;

	useEffect(() => {
		tele.BackButton.hide();

		tele.expand();

		tele.ready();

		window.Telegram.WebApp.setHeaderColor("#191b33"); // Set header color to red

		if (tele.HapticFeedback) {
			tele.HapticFeedback.impactOccurred("medium");
		}
	}, []);

	const startRefillInterval = () => {
		if (refillIntervalRef.current) {
			clearInterval(refillIntervalRef.current);
		}
		refillIntervalRef.current = setInterval(() => {
			setEnergy((prevEnergy) => {
				if (isNaN(prevEnergy) || prevEnergy >= refiller) {
					clearInterval(refillIntervalRef.current);
					setIsRefilling(false);
					return refiller;
				}
				const newEnergy = Math.min(prevEnergy + incrementValue, refiller);
				if (!isNaN(newEnergy)) {
					accumulatedEnergyRef.current = newEnergy;
					localStorage.setItem("energy", newEnergy);
					localStorage.setItem("lastRefillTime", Date.now());
					console.log("Energy saved to local storage:", newEnergy);
				}
				return newEnergy;
			});
		}, refillDuration);
	};

	const refillEnergy = () => {
		setIsRefilling(true);
		startRefillInterval();
	};

	useEffect(() => {
		if (energy < refiller && !isRefilling) {
			refillEnergy();
		}
	}, [energy, isRefilling]);

	useEffect(() => {
		if (id) {
			if (refillIntervalRef.current) {
				clearInterval(refillIntervalRef.current);
			}

			const storedEnergy = localStorage.getItem("energy");
			const lastRefillTime = localStorage.getItem("lastRefillTime");
			let energyValue = defaultEnergy;
			let lastTime = Date.now();

			if (storedEnergy && lastRefillTime) {
				energyValue = Number(storedEnergy);
				lastTime = Number(lastRefillTime);

				if (
					!isNaN(energyValue) &&
					energyValue >= 0 &&
					!isNaN(lastTime) &&
					lastTime > 0
				) {
					const elapsedTime = Date.now() - lastTime;
					const elapsedSteps = Math.floor(elapsedTime / refillDuration);
					const restoredEnergy = Math.min(
						energyValue + elapsedSteps * incrementValue,
						refiller
					);

					if (!isNaN(restoredEnergy) && restoredEnergy >= 0) {
						setEnergy(restoredEnergy);
						if (restoredEnergy < refiller) {
							setIsRefilling(true);
							refillEnergy();
						}
					} else {
						setEnergy(defaultEnergy);
					}
				} else {
					setEnergy(defaultEnergy);
				}
			} else if (storedEnergy) {
				energyValue = Number(storedEnergy);
				if (!isNaN(energyValue) && energyValue >= 0) {
					setEnergy(energyValue);
				} else {
					setEnergy(defaultEnergy);
				}
			} else {
				setEnergy(defaultEnergy);
			}

			localStorage.setItem("energy", energyValue);
			localStorage.setItem("lastRefillTime", lastTime);
		}
	}, [id]);
	function triggerHapticFeedback() {
		const isAndroid = /Android/i.test(navigator.userAgent);
		const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

		if (
			isIOS &&
			window.Telegram &&
			window.Telegram.WebApp &&
			window.Telegram.WebApp.HapticFeedback
		) {
			window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
		} else if (isAndroid && "vibrate" in navigator) {
			navigator.vibrate(50);
		} else {
			console.warn("Haptic feedback not supported on this device.");
		}
	}

	const handleClick = async (e) => {
		triggerHapticFeedback();
		if (energy == 0) {
			return;
		}

		if (energy <= 0 || isDisabled || isUpdatingRef.current) {
			setGlowBooster(true); // Trigger glow effect if energy and points are 0
			setTimeout(() => {
				setGlowBooster(false); // Remove glow effect after 1 second
			}, 300);
			return; // Exit if no energy left or if clicks are disabled or if an update is in progress
		}

		const { offsetX, offsetY, target } = e.nativeEvent;
		const { clientWidth, clientHeight } = target;

		const horizontalMidpoint = clientWidth / 2;
		const verticalMidpoint = clientHeight / 2;

		const animationClass =
			offsetX < horizontalMidpoint
				? "wobble-left"
				: offsetX > horizontalMidpoint
				? "wobble-right"
				: offsetY < verticalMidpoint
				? "wobble-top"
				: "wobble-bottom";

		// Remove previous animations
		imageRef.current.classList.remove(
			"wobble-top",
			"wobble-bottom",
			"wobble-left",
			"wobble-right"
		);

		// Add the new animation class
		imageRef.current.classList.add(animationClass);

		// Remove the animation class after animation ends to allow re-animation on the same side
		setTimeout(() => {
			imageRef.current.classList.remove(animationClass);
		}, 300); // duration should match the animation duration in CSS

		// Increment the count
		const rect = e.target.getBoundingClientRect();
		const newClick = {
			id: Date.now(), // Unique identifier
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};

		setClicks((prevClicks) => [...prevClicks, newClick]);

		setEnergy((prevEnergy) => {
			const newEnergy = Math.max(prevEnergy - tapValue.value, 0); // Ensure energy does not drop below zero
			accumulatedEnergyRef.current = newEnergy;
			return newEnergy;
		});

		setPoints((prevPoints) => prevPoints + 1);
		doubleBoostStart
			? setBalance((prevBalance) => {
					const newBalance = prevBalance + tapValue.value * 2;
					accumulatedBalanceRef.current = newBalance;
					return newBalance;
			  })
			: powerBoostStart
			? setBalance((prevBalance) => {
					const newBalance = prevBalance + tapValue.value * 5;
					accumulatedBalanceRef.current = newBalance;
					return newBalance;
			  })
			: setBalance((prevBalance) => {
					const newBalance = prevBalance + tapValue.value;
					accumulatedBalanceRef.current = newBalance;
					return newBalance;
			  });

		setTapBalance((prevTapBalance) => {
			const newTapBalance = prevTapBalance + 1;
			accumulatedTapBalanceRef.current = newTapBalance;
			return newTapBalance;
		});

		// Remove the click after the animation duration
		setTimeout(() => {
			setClicks((prevClicks) =>
				prevClicks.filter((click) => click.id !== newClick.id)
			);
		}, 800); // Match this duration with the animation duration

		// Reset the debounce timer
		clearTimeout(debounceTimerRef.current);
		debounceTimerRef.current = setTimeout(updateFirestore, 200); // Adjust the delay as needed

		clearInterval(refillIntervalRef.current); // Stop refilling while the user is active
		setIsRefilling(false); // Set refilling state to false
		clearTimeout(refillTimeoutRef.current);
		refillTimeoutRef.current = setTimeout(() => {
			if (energy < battery.energy) {
				refillEnergy();
			}
		}, 10); // Set the inactivity period to 3 seconds (adjust as needed)
	};

	useEffect(() => {
		let startY = 0;

		const handleTouchStart = (e) => {
			startY = e.touches[0].clientY;
		};

		const handleTouchMove = (e) => {
			const endY = e.touches[0].clientY;
			const distance = endY - startY;

			// Disable swipe-down if the user swipes downward
			if (distance > 30) {
				// Adjust threshold as needed
				e.preventDefault(); // Prevent default scrolling
			}
		};

		document.addEventListener("touchstart", handleTouchStart, {
			passive: false,
		});
		document.addEventListener("touchmove", handleTouchMove, {
			passive: false,
		});

		return () => {
			document.removeEventListener("touchstart", handleTouchStart);
			document.removeEventListener("touchmove", handleTouchMove);
		};
	}, []);

	useEffect(() => {
		return () => {
			clearTimeout(debounceTimerRef.current);
			clearTimeout(refillTimeoutRef.current);
		};
	}, []);

	useEffect(() => {
		return () => {
			clearTimeout(debounceTimerRef.current);
			clearTimeout(refillTimeoutRef.current);
		};
	}, []);
	useEffect(() => {
		return () => {
			clearTimeout(debounceTimerRef.current);
			clearInterval(refillIntervalRef.current);
			clearTimeout(refillTimeoutRef.current);
		};
	}, []);

	const updateFirestore = async () => {
		const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
		if (telegramUser) {
			const { id: userId } = telegramUser;
			const userRef = doc(db, "telegramUsers", userId.toString());

			isUpdatingRef.current = true;

			try {
				await updateDoc(userRef, {
					balance: accumulatedBalanceRef.current,
					energy: accumulatedEnergyRef.current,
					tapBalance: accumulatedTapBalanceRef.current,
				});

				accumulatedBalanceRef.current = balance;
				accumulatedEnergyRef.current = energy;
				accumulatedTapBalanceRef.current = tapBalance;
			} catch (error) {
				console.error("Error updating balance and energy:", error);
			} finally {
				isUpdatingRef.current = false;
			}
		}
	};

	const handleClickReferal = async () => {
		const res = await claimRewardsOfReferals(id, claimList);
		if (res.success) {
			sendUserData();
			notify(`Reward has been claimed`);
			setClaimListHere([]);
		} else {
			sendUserData();
			notifyError(`Error claiming reward`);
		}
	};

	const [openPopup, setOpenPopup] = useState(true);

	return (
		<>
			<div>
				<div className={`${loader ? "block" : "hidden"} w-full h-full`}>
					<Loader />
				</div>

				<div
					className={`${
						claimListHere.length !== 0 && openPopup ? "visible" : "invisible"
					} absolute bottom-5 left-0 right-0 bg-[#000000B2]`}>
					<div
						className={` fixed bottom-0 left-0 right-0 h-fit modal_background  z-50 backdrop-blur-sm  border-t-[3px] border-[#A51CF5] rounded-tl-[20px] rounded-tr-[20px] flex justify-center container-1 pb-[12px] pt-[51px] text-white bg-[#0A031880]`}>
						<div className='w-full flex flex-col justify-between'>
							<button
								onClick={() => setOpenPopup(false)}
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

							<div className='w-full -mt-10 pb-14 text-center'>
								<img
									alt='claim'
									src={award}
									className='w-[100px] mx-auto'
								/>
								<div className='flex flex-col gap-y-[7px]'>
									<h3 className=' text-[32px]'>Claim Referal Reward</h3>
									<p className='text-[16px] mx-auto'>
										Wow!!! Good News, Someone from your Friends has accepted
										your Invite, Click here to claim Reward
									</p>
								</div>
								<button
									onClick={() => {
										handleClickReferal();
									}}
									className=' invite-friend-button py-[10px] px-4 w-fit border border-[#A51CF5] rounded-md mt-[14px] text-[16px] text-white bg-[#0A0318] bg-gradient-to-l from-[#35107E]'>
									Claim
								</button>
							</div>
							<div className='flex justify-center items-center gap-x-[4px] mt-[23px]'></div>
						</div>
					</div>
				</div>

				<div
					className={`w-full min-h-screen text-white flex flex-col px-3 items-center gap-6 font-sans
				bg-[url('/src/assets/MainBackground.png')] bg-cover ${
					loader ? "hidden" : "block"
				}`}>
					<div className=' w-full flex justify-end  sticky top-0 pt-5  '>
						<div className='flex justify-between  gap-4 items-center w-full'>
							<div className='flex items-center gap-x-2 text-sm'>
								<div className='w-10 h-10 flex justify-center items-center text-[13px] rounded-full bg-[#171a46e5] text-white'>
									{username?.slice(0, 1)}
								</div>
								{username}
							</div>
							<Link to={"https://t.me/kvantsnews"}>
								<div className='  bg-transparent border-gradAlt border float-right w-[175x] mx-auto px-4 py-1 rounded-full flex  justify-center gap-2   items-center'>
									<span className='krona text-[14px]'>Join Kvants</span>
									<img
										width={1000}
										height={1000}
										src={add}
										alt=''
										className='w-[30px]'
									/>
								</div>
							</Link>
						</div>
					</div>
					<div
						className='flex justify-center
         w-full items-center  my-[10px]'>
						<Link
							to={"/leaderboard"}
							className='bg-[linear-gradient(90deg,#112946_0%,#2823A9_50%,#2100EC_100%)] flex gap-2 items-center px-4 py-2  rounded-full'>
							<img
								src={star}
								width={500}
								height={500}
								className='w-[12px]'
								alt=''
							/>
							<span>Leaderboard</span>
						</Link>
					</div>
					<div className='w-full flex justify-center items-center '>
						<button className='flex   py-1 items-center gap-2 rounded-full min-w-[250px] justify-center bg-transparent border border-offwhite'>
							<img
								src={kvaiCoin}
								width={500}
								height={500}
								alt='kviacoin'
								className='w-[33px]'
							/>
							<span className=' '>
								{energy}/{battery?.energy}
							</span>
						</button>{" "}
					</div>
					<div
						onPointerDown={handleClick}
						className='w-[370px] h-full relative flex items-center justify-center'>
						<div className='image-container'>
							<Container>
								<img
									src={robot}
									width={1000}
									height={1000}
									className='  wobble-image select-none h-full'
									ref={imageRef}
									priority
									loading='eager'
									alt='robot'
								/>
								{clicks?.map((click) => (
									<SlideUpText
										key={click?.id}
										x={click?.x}
										y={click?.y}>
										+
										{doubleBoostStart
											? tapValue?.value * 2
											: powerBoostStart
											? tapValue?.value * 5
											: tapValue?.value}
									</SlideUpText>
								))}
							</Container>
						</div>
					</div>
					<div className='flex items-center justify-center gap-2 fixed bottom-[70px] z-10 w-full   touch-none '>
						<img
							alt='logo'
							src={kvaiCoin}
							width={500}
							height={500}
							className='w-[60px] h-full'
						/>
						<h1 className='text-[40px] font-bold'>{balance}</h1>
					</div>
					<div className=''>
						<img
							src={shadow}
							width={500}
							height={500}
							className='fixed bottom-0 left-0 right-0 w-full'
							alt=''
						/>
						<Footer
							fixed={true}
							currentPage={0}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
