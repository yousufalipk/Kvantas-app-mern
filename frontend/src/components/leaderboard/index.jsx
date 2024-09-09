import { useEffect, useState } from "react";
import { useUser } from "../../context";
import { add, kvaiCoin, search, speaker } from "../../assets";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
	const {
		topUser,
		topUserWeek,
		balance,
		searchQuery,
		searchWeekQuery,
		handleSearchChange,
		handleSearchWeekChange,
		fetchUsersWeek,
		fetchUsersDay,
		overallBalance,
	} = useUser();

	const navigate = useNavigate();

	useEffect(() => {
		const tg = window.Telegram.WebApp;

		tg.BackButton.show();
		tg.BackButton.onClick(() => {
			navigate("/");
		});

		return () => {
			tg.BackButton.hide();
			tg.BackButton.offClick();
		};
	}, [navigate]);

	const [tab, setTab] = useState(true);

	const filteredTopUser = topUser?.filter((user) =>
		user.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Removed the date filter, relying on API to provide correct data for the week
	const filteredTopUserWeek = topUserWeek?.filter((user) =>
		user.username.toLowerCase().includes(searchWeekQuery.toLowerCase())
	);

	return (
		<>
			<div className="w-full min-h-screen text-white flex flex-col items-center font-sans bg-[url('/src/assets/MainBackground.png')] overflow-x-hidden pt-5  px-3  bg-cover  ">
				<div className='w-full flex flex-col justify-center items-center bg-transparent relative'>
					<h1 className='text-2xl font-bold '>Leaderboard</h1>
					<div className='flex items-center gap-2  my-[11px]'>
						<img
							src={kvaiCoin}
							alt=''
							className='w-[33px] h-[34px]'
						/>
						<h1 className='text-[16px] font-bold'>{balance} Total Balance</h1>
					</div>
				</div>

				<div className='h-[1px] bg-[#353642] w-full mb-[20px]'></div>
				<div className='w-full grid grid-cols-2 text-[14spx] font-semibold items-center leaderbord-button-bg py-[2px] px-[5px] rounded-[11px] mb-[52px]'>
					<button
						onClick={() => {
							setTab(true);
							searchQuery ? fetchUsersDay(searchQuery) : fetchUsersDay();
						}}
						className={`rounded-[10px]  w-full ${
							tab ? "button-bg" : ""
						}  text-center p-[6px]`}>
						Day
					</button>
					<button
						onClick={() => {
							setTab(false);
							searchWeekQuery
								? fetchUsersWeek(searchWeekQuery)
								: fetchUsersWeek();
						}}
						className={`rounded-[10px]  w-full ${
							!tab ? "button-bg" : ""
						}  text-center p-[6px]`}>
						Weekly
					</button>
				</div>

				{tab ? (
					<div className='w-full mb-[26px] relative '>
						<input
							type='text'
							value={searchQuery}
							onChange={(e) => handleSearchChange(e)}
							placeholder='Search by username'
							className='bg-white px-[32px] py-[6px] text-[16px] focus:outline-none  w-full text-[#332828] placeholder:text-[#332828] rounded-[20px] '
						/>
						<img
							src={search}
							alt='search'
							className='absolute -right-1 -top-[2px] h-[42px] w-[40px]'
						/>
					</div>
				) : (
					<div className='w-full mb-[26px] relative '>
						<input
							type='text'
							value={searchWeekQuery}
							onChange={(e) => handleSearchWeekChange(e)}
							placeholder='Search by username'
							className='bg-white px-[32px] py-[6px] text-[16px] focus:outline-none  w-full text-[#332828] placeholder:text-[#332828] rounded-[20px] '
						/>
						<img
							src={search}
							alt='search'
							className='absolute -right-1 -top-[2px] h-[42px] w-[40px]'
						/>
					</div>
				)}

				<div className='flex flex-col gap-4 w-full '>
					{tab ? (
						<div className='flex flex-col gap-2 w-full max-h-[53%] overflow-y-auto'>
							{filteredTopUser?.length === 0 ? (
								<div className='text-sm'>No user found</div>
							) : null}
							{filteredTopUser?.map((user, i) => (
								<div
									key={i}
									className=' border-gradAlt border  bg-[linear-gradient(90deg,#000B95_0%,#47484F_100%)]
                    px-3 py-2 rounded-[20px] w-full flex items-center  gap-2'>
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
												<span className='font-bold'> {user?.balance}</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='flex flex-col gap-2 w-full max-h-[53%] overflow-y-auto'>
							{filteredTopUserWeek?.length === 0 ? (
								<div className='text-sm'>No user found</div>
							) : null}
							{filteredTopUserWeek?.map((user, i) => (
								<div
									key={i}
									className='border-gradAlt border bg-[linear-gradient(90deg,#000B95_0%,#47484F_100%)] px-3 py-2 rounded-[20px] w-full flex items-center gap-2'>
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
												<span className='font-bold'> {user?.balance}</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Leaderboard;
