import { back } from "../../assets";
import { useUser } from "../../context";
import { Link } from "react-router-dom";

const Header = () => {
  const { username } = useUser();
  function splitUsername(username) {
    if (username?.length > 8) {
      return username.slice(0, 8) + "...";
    } else {
      return username;
    }
  }
  return (
    <div className="flex items-center justify-between w-full font-sans py-[17px] px-[18px] ">
      <Link
        to={"/"}
        className="flex justify-start items-center w-full bg-transparent"
      >
        <img
          src={back}
          width={500}
          height={500}
          className="w-[18.41px]"
          alt="back"
        />
      </Link>
      <h2 className="w-full flex  justify-center text-xl items-center">
        Kvants Tap
      </h2>
      <button className="w-full flex justify-end items-center text-base text-white bg-transparent ">
        {splitUsername(username)}
      </button>
    </div>
  );
};
export default Header;
