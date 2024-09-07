import React from "react";
import { LuLoader2 } from "react-icons/lu";

function Loader() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-no-repeat  bg-[url('/src/assets/MainBackground.png')] overflow-hidden text-xl text-slate-100  bg-cover ">
      <LuLoader2 className="animate-spin w-[50px] h-[50px]" />
    </div>
  );
}

export default Loader;
