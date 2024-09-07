import React from "react";
import { speaker } from "../../assets";
import { completed_img, incomplete_img, kvaiCoin } from "../../assets";

const AnnouncementHandle = ({ reward, onClick, status }) => {
	// console.log(status);
	// console.log(reward);
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

	return (
		<>
			<button
				disabled={status === "verifying" || status === "verified"}
				onClick={(e) => {
					triggerHapticFeedback();
					onClick();
				}}
				className=' bg-[linear-gradient(180.64deg,#3919FF_-1.34%,#1C020D_116.51%)]    cursor-pointer    px-3 py-3  rounded-[20px] w-full flex items-center gap-4 relative   '>
				{status === "verified" ? (
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
							<span>{reward}</span>
						</div>
					</div>

					{status === "verifying" && (
						<span className='text-green-600 text-sm font-bold -ml-16 mt-7'>
							Verifying...
						</span>
					)}

					<div className='absolute -top-4 right-1  '>
						<img
							src={speaker}
							alt=''
							className='w-[80px] h-[84px]'
						/>
					</div>
				</div>
			</button>
		</>
	);
};

export default AnnouncementHandle;
