import { boost, friend, quest, tapAndEarn } from "../../assets";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";

const Footer = ({ currentPage = 0, fixed = true }) => {
	const navigate = useNavigate();

	return (
		<div
			className={classNames(
				"w-11/12 mx-auto bg-[#0C0F47E5] p-1 rounded-full grid grid-cols-5 ",
				{ "fixed bottom-2 z-50 left-1/2 -translate-x-1/2": fixed }
			)}>
			<Link
				to={"/"}
				className={classNames("flex items-center justify-center flex-col", {
					"bg-[#0A0318] rounded-full w-20 mx-auto py-1": currentPage === 0,
					"filter grayscale": currentPage !== 0,
				})}>
				<img
					width={500}
					height={500}
					src={tapAndEarn}
					alt=''
					className='h-7 w-7 mx-auto'
				/>
				<span className='text-xs'>Tap & Earn</span>
			</Link>
			<Link
				to={"/boost"}
				className={classNames("flex items-center justify-center flex-col", {
					"bg-[#0A0318] rounded-full w-20 mx-auto py-1": currentPage === 1,
					"filter grayscale": currentPage !== 1,
				})}>
				<img
					width={500}
					height={500}
					src={boost}
					alt=''
					className='h-7 w-7 mx-auto'
				/>
				<span className='text-xs'>Boost</span>
			</Link>
			<Link
				to={"/tasks"}
				className={classNames("flex items-center justify-center flex-col", {
					"bg-[#0A0318] rounded-full w-20 mx-auto py-1": currentPage === 4,
					"filter grayscale": currentPage !== 4,
				})}>
				<img
					width={500}
					height={500}
					src={quest}
					alt=''
					className='h-7 w-7 mx-auto'
				/>
				<span className='text-xs'>Quest</span>
			</Link>
			<Link
				to={"/refer"}
				className={classNames("flex items-center justify-center flex-col", {
					"bg-[#0A0318] rounded-full w-20 mx-auto py-1": currentPage === 5,
					"filter grayscale": currentPage !== 5,
				})}>
				<img
					width={500}
					height={500}
					src={friend}
					alt=''
					className='h-7 w-7 mx-auto'
				/>
				<span className='text-xs'>Friends</span>
			</Link>
			<Link
				to={"/wallet"}
				className={classNames("flex items-center justify-center flex-col", {
					"bg-[#0A0318] rounded-full w-20 mx-auto py-1": currentPage === 6,
					"filter grayscale": currentPage !== 6,
				})}>
				<img
					width={500}
					height={500}
					src={friend}
					alt=''
					className='h-7 w-7 mx-auto'
				/>
				<span className='text-xs'>Wallet</span>
			</Link>
		</div>
	);
};

export default Footer;
