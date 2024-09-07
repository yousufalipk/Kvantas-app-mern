import Timer from "../common/Timer";

const BoostDailyCard = ({
	img,
	title,
	desc,
	no,
	time,
	startTime,
	onClick,
	isLoading,
}) => {
	return (
		<div className='flex gap-[6px]'>
			<div className='bg-[#000DA9] rounded-[20px] w-[86px] h-[86px] p-[17px] flex justify-center items-center'>
				<img
					src={img}
					alt=''
					className='w-full h-full'
				/>
			</div>
			<button
				disabled={isLoading ? isLoading : false}
				onClick={onClick && onClick}
				className='w-full flex-1 bg-[#000DA9] rounded-[20px] py-[8px] px-[16px] flex flex-col cursor-pointer'>
				<h2 className='text-[16px] mb-[6px]'>{title}</h2>
				<p className='text-[10px] text-[#CACDF9] mb-[8px] text-start'>{desc}</p>
				<div className='flex justify-between items-center w-full'>
					<div className='font-bold text-[13px]'>{no}</div>
					<div className=''>
						{startTime && <Timer initialTimeInSeconds={time} />}
					</div>
				</div>
			</button>
		</div>
	);
};

export default BoostDailyCard;
