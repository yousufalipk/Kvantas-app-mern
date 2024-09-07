import React, { useEffect, useState } from "react";
import { useUser } from "../../context";
import { kvaiCoin } from "../../assets";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";

import Footer from "../common/footer";
import { notify } from "../../utils/notify";

const Wallet = () => {
	const { balance, updateWalletAddress } = useUser();
	const wallet = useTonWallet();
	const [walletAddress, setWalletAddress] = useState("");

	useEffect(() => {
		const updateAddress = async () => {
			if (wallet && wallet.account) {
				const walletAddress = wallet.account.address;
				setWalletAddress(walletAddress);
				try {
					await updateWalletAddress(walletAddress);
				} catch (error) {
					console.error("Failed to update wallet address:", error);
				}
			}
		};

		updateAddress();
	}, [wallet, updateWalletAddress]);

	return (
		<div className="w-full min-h-screen text-white flex flex-col items-center gap-6 font-sans bg-[url('/src/assets/MainBackground.png')] overflow-x-hidden pt-5 px-3 bg-cover">
			<div className='flex flex-col gap-4 w-full px-3'>
				<div className='flex justify-start w-full items-center'>
					<button className='bg-[linear-gradient(90deg,#112946_0%,#2823A9_50%,#2100EC_100%)] flex gap-2 items-center px-4 py-2 rounded-full'>
						<span className='text-xs'>Total Balance</span>
					</button>
				</div>
				<div className='flex items-center gap-2 mx-auto'>
					<img
						src={kvaiCoin}
						alt=''
					/>
					<h1 className='text-4xl font-bold'>{balance}</h1>
				</div>
				<div className='w-full'>
					<hr />
				</div>
				<div>
					<div>
						<h6 className='font-bold text-[14px]'>Wallet</h6>
					</div>
					<div className='ml-48'>
						<TonConnectButton />
					</div>
				</div>
				<div className='fixed bottom-4'>
					<Footer currentPage={6} />
				</div>
			</div>
		</div>
	);
};

export default Wallet;
