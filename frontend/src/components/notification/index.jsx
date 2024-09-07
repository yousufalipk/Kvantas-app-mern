import kvai from "../../assets/kvai.png";
import Notificationleft from "../../assets/dailyNews2.png";
import NotificationRight from "../../assets/dailyNews3.png";
import { useUser } from "../../context";
import { useState } from "react";

const Notification = () => {
	const { announcement } = useUser();
	const [isOpen, setIsOpen] = useState(true);
	return (
		<>
			{isOpen && (
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
								{announcement.subtitle}
							</p>
							<p className='text-center text-white text-sm leading-[100%] mb-[20px]'>
								{announcement.description}
							</p>
							<input
								type='text'
								placeholder='Paste Your Link'
								className='bg-white border-red rounded-full p-[6px] w-full text-center'
							/>
							<div className='h-[38px] w-[120px] bg-gradient-to-b from-[#4D4351] p-[1px] rounded-full mt-[10px] self-center'>
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
			)}
		</>
	);
};

export default Notification;
