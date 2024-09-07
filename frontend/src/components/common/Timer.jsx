import React, { useState, useEffect } from "react";

const Timer = ({ initialTimeInSeconds }) => {
  const [time, setTime] = useState(initialTimeInSeconds);

  useEffect(() => {
    if (time > 0) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      // setYoutubeTime()
    }
  }, [time]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return ` ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return <p className="text-xs text-end"> {formatTime(time)}</p>;
};

export default Timer;
