// import React from "react";
// import { Link } from "react-router-dom";
// import {
// 	completed_img,
// 	incomplete_img,
// 	kvaiCoin,
// 	telegram,
// 	insta,
// 	x,
// 	world,
// 	youtube,
// 	plane,
// } from "../../assets";
// import { LuLoader2 } from "react-icons/lu";
// import { useState } from "react";

// const TaskItem = ({
// 	title,
// 	reward,
// 	link,
// 	image,
// 	onClick,
// 	isVerify,
// 	isButtonType,
// 	task,
// 	id,
// 	setIsTwitter,
// 	isLinkVerify,
// 	getData,
// 	checkDaily,
// }) => {
// 	function triggerHapticFeedback() {
// 		const isAndroid = /Android/i.test(navigator.userAgent);
// 		const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// 		if (
// 			isIOS &&
// 			window.Telegram &&
// 			window.Telegram.WebApp &&
// 			window.Telegram.WebApp.HapticFeedback
// 		) {
// 			window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
// 		} else if (isAndroid && "vibrate" in navigator) {
// 			navigator.vibrate(50);
// 		} else {
// 			console.warn("Haptic feedback not supported on this device.");
// 		}
// 	}

// 	return (
// 		<>
// 			{(isVerify && isButtonType === id) || task?.includes(id) ? (
// 				<div className=' bg-[linear-gradient(180.64deg,#3919FF_-1.34%,#1C020D_116.51%)] px-3 py-3  rounded-[20px] w-full flex items-center gap-4 relative   '>
// 					{isVerify && isButtonType === id ? (
// 						<LuLoader2 className='animate-spin w-[55px] h-[55px]' />
// 					) : task?.includes(id) ? (
// 						<img
// 							src={completed_img}
// 							alt=''
// 						/>
// 					) : (
// 						<img
// 							src={incomplete_img}
// 							alt=''
// 						/>
// 					)}
// 					<div className='flex gap-2 items-center '>
// 						<div className='flex flex-col'>
// 							<span className=''>{title}</span>
// 							<div className='flex items-center gap-1 text-sm '>
// 								<img
// 									src={kvaiCoin}
// 									alt=''
// 									className='w-5 h-5'
// 								/>
// 								<span>{reward}</span>
// 							</div>
// 						</div>

// 						<div className='absolute -top-4 right-1  '>
// 							<img
// 								src={
// 									image == "telegram"
// 										? telegram
// 										: image == "twitter"
// 										? x
// 										: image == "instagram"
// 										? insta
// 										: image == "moreLink"
// 										? world
// 										: image == "youtube"
// 										? youtube
// 										: plane
// 								}
// 								alt=''
// 								className='w-[80px] h-[84px]'
// 							/>
// 						</div>
// 					</div>
// 				</div>
// 			) : (
// 				<>
// 					{image === "twitter" ? (
// 						<Link
// 							onClick={(e) => {
// 								triggerHapticFeedback();
// 								// setTimeout(() => onClick(reward, id, image), 3000);
// 								getData(reward, id, checkDaily);
// 								image === "twitter" && setIsTwitter(true);
// 							}}
// 							to={`https://${link}`}
// 							target={"_blank"}
// 							className=' bg-[linear-gradient(180.64deg,#3919FF_-1.34%,#1C020D_116.51%)] cursor-pointer    px-3 py-3  rounded-[20px] w-full flex items-center gap-4 relative   '>
// 							{isLinkVerify && isButtonType === id ? (
// 								<LuLoader2 className='animate-spin w-[55px] h-[55px]' />
// 							) : task?.includes(id) ? (
// 								<img
// 									src={completed_img}
// 									alt=''
// 								/>
// 							) : (
// 								<img
// 									src={incomplete_img}
// 									alt=''
// 								/>
// 							)}
// 							<div className='flex gap-2 items-center '>
// 								<div className='flex flex-col'>
// 									<span className=''>{title}</span>
// 									<div className='flex items-center gap-1 text-sm '>
// 										<img
// 											src={kvaiCoin}
// 											alt=''
// 											className='w-5 h-5'
// 										/>
// 										<span>{reward}</span>
// 									</div>
// 								</div>

// 								<div className='absolute -top-4 right-1  '>
// 									<img
// 										src={
// 											image == "telegram"
// 												? telegram
// 												: image == "twitter"
// 												? x
// 												: image == "instagram"
// 												? insta
// 												: image == "moreLink"
// 												? world
// 												: image == "youtube"
// 												? youtube
// 												: plane
// 										}
// 										alt=''
// 										className='w-[80px] h-[84px]'
// 									/>
// 								</div>
// 							</div>
// 						</Link>
// 					) : image === "telegram" ? (
// 						<Link
// 							onClick={(e) => {
// 								triggerHapticFeedback();
// 								setTimeout(() => onClick(reward, id, image, checkDaily), 3000);
// 								// getChannelData(reward, id, image, checkDaily);
// 							}}
// 							to={`https://${link}`}
// 							target={"_blank"}
// 							className=' bg-[linear-gradient(180.64deg,#3919FF_-1.34%,#1C020D_116.51%)] cursor-pointer    px-3 py-3  rounded-[20px] w-full flex items-center gap-4 relative   '>
// 							{isLinkVerify && isButtonType === id ? (
// 								<LuLoader2 className='animate-spin w-[55px] h-[55px]' />
// 							) : task?.includes(id) ? (
// 								<img
// 									src={completed_img}
// 									alt=''
// 								/>
// 							) : (
// 								<img
// 									src={incomplete_img}
// 									alt=''
// 								/>
// 							)}
// 							<div className='flex gap-2 items-center '>
// 								<div className='flex flex-col'>
// 									<span className=''>{title}</span>
// 									<div className='flex items-center gap-1 text-sm '>
// 										<img
// 											src={kvaiCoin}
// 											alt=''
// 											className='w-5 h-5'
// 										/>
// 										<span>{reward}</span>
// 									</div>
// 								</div>

// 								<div className='absolute -top-4 right-1  '>
// 									<img
// 										src={
// 											image == "telegram"
// 												? telegram
// 												: image == "twitter"
// 												? x
// 												: image == "instagram"
// 												? insta
// 												: image == "moreLink"
// 												? world
// 												: image == "youtube"
// 												? youtube
// 												: plane
// 										}
// 										alt=''
// 										className='w-[80px] h-[84px]'
// 									/>
// 								</div>
// 							</div>
// 						</Link>
// 					) : (
// 						<Link
// 							onClick={(e) => {
// 								triggerHapticFeedback();
// 								setTimeout(() => onClick(reward, id), 3000);
// 							}}
// 							to={`https://${link}`}
// 							target={"_blank"}
// 							rel='noopener noreferrer'
// 							className=' bg-[linear-gradient(180.64deg,#3919FF_-1.34%,#1C020D_116.51%)]    cursor-pointer    px-3 py-3  rounded-[20px] w-full flex items-center gap-4 relative   '>
// 							{isVerify && isButtonType === id ? (
// 								<LuLoader2 className='animate-spin w-[55px] h-[55px]' />
// 							) : task?.includes(id) ? (
// 								<img
// 									src={completed_img}
// 									alt=''
// 								/>
// 							) : (
// 								<img
// 									src={incomplete_img}
// 									alt=''
// 								/>
// 							)}
// 							<div className='flex gap-2 items-center '>
// 								<div className='flex flex-col'>
// 									<span className=''>{title}</span>
// 									<div className='flex items-center gap-1 text-sm '>
// 										<img
// 											src={kvaiCoin}
// 											alt=''
// 											className='w-5 h-5'
// 										/>
// 										<span>{reward}</span>
// 									</div>
// 								</div>

// 								<div className='absolute -top-4 right-1  '>
// 									<img
// 										src={
// 											image == "telegram"
// 												? telegram
// 												: image == "twitter"
// 												? x
// 												: image == "instagram"
// 												? insta
// 												: image == "moreLink"
// 												? world
// 												: image == "youtube"
// 												? youtube
// 												: plane
// 										}
// 										alt=''
// 										className='w-[80px] h-[84px]'
// 									/>
// 								</div>
// 							</div>
// 						</Link>
// 					)}
// 				</>
// 			)}
// 		</>
// 	);
// };

// export default TaskItem;

import React from "react";
import { Link } from "react-router-dom";
import {
	completed_img,
	incomplete_img,
	kvaiCoin,
	telegram,
	insta,
	x,
	world,
	youtube,
	plane,
} from "../../assets";
import { LuLoader2 } from "react-icons/lu";

const TaskItem = ({
	title,
	reward,
	link,
	image,
	onClick,
	isVerify,
	isButtonType,
	task,
	id,
	setIsTwitter,
	isLinkVerify,
	getData,
	checkDaily,
}) => {
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

	const handleClick = (e) => {
		triggerHapticFeedback();

		// Handle actions based on the image type
		if (image === "twitter") {
			getData(reward, id, checkDaily);
			setIsTwitter(true);
		} else if (image === "telegram") {
			setTimeout(() => onClick(reward, id, image, checkDaily), 3000);
		} else {
			setTimeout(() => onClick(reward, id), 3000);
		}
	};

	const renderImage = (imgType) => {
		switch (imgType) {
			case "telegram":
				return telegram;
			case "twitter":
				return x;
			case "instagram":
				return insta;
			case "moreLink":
				return world;
			case "youtube":
				return youtube;
			default:
				return plane;
		}
	};

	return (
		<>
			{(isVerify[id] && isButtonType[id] === id) || task?.includes(id) ? (
				<div className='bg-[linear-gradient(180.64deg,#3919FF_-1.34%,#1C020D_116.51%)] px-3 py-3 rounded-[20px] w-full flex items-center gap-4 relative'>
					{isVerify[id] && isButtonType[id] === id ? (
						<LuLoader2 className='animate-spin w-[55px] h-[55px]' />
					) : task?.includes(id) ? (
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
					<div className='flex gap-2 items-center'>
						<div className='flex flex-col'>
							<span className=''>{title}</span>
							<div className='flex items-center gap-1 text-sm'>
								<img
									src={kvaiCoin}
									alt=''
									className='w-5 h-5'
								/>
								<span>{reward}</span>
							</div>
						</div>

						<div className='absolute -top-4 right-1'>
							<img
								src={renderImage(image)}
								alt=''
								className='w-[80px] h-[84px]'
							/>
						</div>
					</div>
				</div>
			) : (
				<Link
					onClick={handleClick}
					to={`https://${link}`}
					target={"_blank"}
					rel='noopener noreferrer'
					className='bg-[linear-gradient(180.64deg,#3919FF_-1.34%,#1C020D_116.51%)] cursor-pointer px-3 py-3 rounded-[20px] w-full flex items-center gap-4 relative'>
					{isLinkVerify && isButtonType[id] === id ? (
						<LuLoader2 className='animate-spin w-[55px] h-[55px]' />
					) : task?.includes(id) ? (
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
					<div className='flex gap-2 items-center'>
						<div className='flex flex-col'>
							<span className=''>{title}</span>
							<div className='flex items-center gap-1 text-sm'>
								<img
									src={kvaiCoin}
									alt=''
									className='w-5 h-5'
								/>
								<span>{reward}</span>
							</div>
						</div>

						<div className='absolute -top-4 right-1'>
							<img
								src={renderImage(image)}
								alt=''
								className='w-[80px] h-[84px]'
							/>
						</div>
					</div>
				</Link>
			)}
		</>
	);
};

export default TaskItem;
