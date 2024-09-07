import { useState } from "react";
import { useUser } from "../../context";
import { icons } from "../../utils/icons";
import { kvaiCoin, speaker } from "../../assets";

import Footer from "../common/footer";
import { Link } from "react-router-dom";

const ReferalSystem = () => {
	const { id, referrals, balance } = useUser();
	const [copied, setCopied] = useState(false);
	const copyToClipboard = async () => {
		const reflink = `https://t.me/kvants_tap_earn_bot?start=r${id}`;

		const textArea = document.createElement("textarea");
		textArea.value = reflink;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand("copy");
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy", err);
		}
		document.body.removeChild(textArea);
	};

	return (
		<>
			<div className="w-full min-h-screen text-white flex flex-col items-center gap-6 font-sans bg-[url('/src/assets/MainBackground.png')] overflow-x-hidden pt-5  px-3  bg-cover  ">
				<div className='w-full flex items-center justify-center gap-2 bg-transparent'>
					<h1 className='text-2xl font-bold'>Invite Friends, get</h1>
					<img
						className='w-[30px] -mb-1'
						src={kvaiCoin}
						alt='Coin'
					/>
				</div>
				<div className='w-full flex justify-between text-sm rounded-md font-sans text-white bg-[#122853] border border-[#4e3bc6]'>
					<div className='p-4'>
						<div className='font-bold'>Invite a Friend</div>
						<div className='flex items-center py-[2px] gap-1'>
							<div className=''>
								<img
									className='w-[18px] mt-1'
									src={kvaiCoin}
									alt='Coin'
								/>
							</div>
							<div className='text-xs'>
								<span className='font-bold text-sm'>Upto 10k</span> for you and
								your mate
							</div>
						</div>
						<div className='pt-3 font-bold'>Friends with Telegram Premium</div>
						<div className='flex items-center py-[2px] gap-1'>
							<div className=''>
								<img
									className='w-[18px] mt-1'
									src={kvaiCoin}
									alt='Coin'
								/>
							</div>
							<div className='text-xs'>
								<span className='font-bold text-sm'>Upto 25k</span> for you and
								your mate
							</div>
						</div>
					</div>
					<div className='flex  justify-center items-center w-[30%]'>
						<img
							className='w-[100%]'
							src={speaker}
							alt='Speaker-Icon'
						/>
					</div>
				</div>
				<div className='flex flex-col gap-4 w-full px-3'>
					<div className='w-full flex items-start justify-start '>
						<h4 className='font-bold'>Your Friends</h4>
					</div>

					<div className='flex flex-col gap-2 w-full max-h-[250px] overflow-y-auto'>
						{referrals?.length === 0 ? (
							<div className='text-xs'>Your list is empty </div>
						) : null}
						{referrals?.map((user, i) => (
							<div
								key={i}
								className=' border-gradAlt border  bg-[linear-gradient(90deg,#000B95_0%,#47484F_100%)] 
           px-3 py-2 rounded-[20px] w-full flex items-center  gap-4'>
								<span>{i + 1}</span>
								<div className='flex gap-2'>
									<div className='w-[52.5px] h-[52.5px] text-center flex items-center justify-center text-[18px] bg-black rounded-full'>
										{user?.username.charAt(0)}
									</div>
									<div className=''>
										<p className='text-[16px] mb-[5px]'>{user?.username}</p>
										<div className='flex items-center gap-1 text-[15px] '>
											<img
												width={500}
												height={500}
												src={kvaiCoin}
												alt=''
												className='w-5 h-5'
											/>
											<span className='font-bold'>
												{user?.isPremium ? 25000 : 10000}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className='w-full flex justify-center sm:pr-8 pr-6 fixed bottom-20'>
						<div className='flex gap-4 items-center'>
							<Link
								to={`https://t.me/share/url?url=https://t.me/kvants_tap_earn_bot?start=r${id}&text=Hey  I just made ${balance} $KVAI Points on Kvants Tap To Earn Game ! The airdrop is definitely going to be huge ! Join via my referral link and we both can get a headstart.`}>
								<div className=' bg-[#4e3bc6] float-right w-[210px] px-4 py-2.5 text-lg rounded-md flex justify-center gap-2   items-center'>
									<span className='krona text-[14px]'>Invite Friends</span>
								</div>
							</Link>
							<div
								className='cursor-pointer'
								onClick={copyToClipboard}>
								{icons?.copy}
							</div>
						</div>
					</div>
					<div className='fixed bottom-4'>
						<Footer currentPage={5}></Footer>
					</div>
				</div>
			</div>
		</>
	);
};

export default ReferalSystem;
