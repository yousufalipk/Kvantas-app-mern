import { Link } from "react-router-dom";
import { useUser } from "../../context";
import classNames from "classnames";

const actionItems = [
  { image: "/src/assets/retweet.png", name: "Retweet", link: "#" },
  { image: "/src/assets/like.png", name: "Like", link: "#" },
  { image: "/src/assets/comment.png", name: "Comment", link: "#" },
];
const TaskPageDialog = () => {
  const { showTaskDialog, setShowTaskDialog } = useUser();
  return (
    <div
      className={classNames(
        "flex bg-[#0a0318d2] fixed  bottom-0 pt-12 pb-8 px-3 z-10 w-full translate-y-full h-[400px]",
        { "translate-y-0": showTaskDialog }
      )}
    >
      {/* <div className="flex  w-full h-full -z-10 absolute blur-sm"></div> */}
      <div className="grid grid-rows-[min-content_auto] w-full">
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 w-full">
          {actionItems.map((item) => (
            <Link to={item.link} className="w-full">
              <div className="flex w-full rounded-[20px] gap-3 border border-white bg-[linear-gradient(109.67deg,#3919FF_-4.47%,#1C020D_-4.47%,#2A0D81_60.98%)] items-center h-10 text-white">
                <img src={item.image}></img>
                <div className="text-lg">{item.name}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex h-full w-full items-end justify-center">
          <div
            className="bg-[linear-gradient(90deg,#0A0318_0%,#35107E_100%)] w-1/2 text-white py-3 border-gradAlt text-center border rounded-[200px] cursor-pointer"
            onClick={() => {
              setShowTaskDialog(false);
            }}
          >
            Click Here
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPageDialog;
