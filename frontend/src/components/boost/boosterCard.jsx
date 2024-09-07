import { kvaiCoin } from "../../assets";

const BoosterCard = ({ img, title, desc, amount, time, onClick }) => {
	return (
		<div
			onClick={onClick}
			className='bg-[#000DA9] rounded-[20px] py-[14px] px-[16px] flex gap-[20px]'>
			<img
				src={img}
				alt=''
				className='w-[64px] h-[67px]'
			/>
			<div className='w-full'>
				<h2 className='text-[16px] mb-[10px]'>{title}</h2>
				<p className='text-[10px] text-[#CACDF9] mb-[8px]'>{desc}</p>
				<div className='flex justify-between items-end'>
					<div className='flex gap-[4px] items-center'>
						<img
							src={kvaiCoin}
							alt=''
							className='w-4 h-4'
						/>
						<p className='font-bold text-[13px]'>{amount}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BoosterCard;
