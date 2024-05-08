import React, { useState, useEffect, useRef } from 'react';

const CountdownComplite = () => {
  const [countdownTime, setCountdownTime] = useState(3600); // 3600 seconds = 1 hour
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isPaused && !isStopped) {
      timerRef.current = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
        } else {
          clearInterval(timerRef.current);
          // Do something when countdown reaches zero
        }
      }, 1000); // Update every second
    }

    return () => clearInterval(timerRef.current);
  }, [timeLeft, isPaused, isStopped]);

  const handlePause = () => {
    clearInterval(timerRef.current);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    clearInterval(timerRef.current);
    setIsStopped(true);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsPaused(false);
    setIsStopped(false);
    setTimeLeft(countdownTime);
  };

  const addOneHour = () => {
    setCountdownTime(countdownTime + 3600); // Add 1 hour (3600 seconds)
    setTimeLeft(timeLeft + 3600); // Update time left
};

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    return `${hours}:${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
  };

  return (
    <div>
      <h1>Countdown</h1>
      <p>Time Left: {formatTime(timeLeft)}</p>
      {!isStopped && (
        <>
          <button onClick={handlePause}>Pause</button>
          <button onClick={handleStop}>Stop</button>
        </>
      )}
      {isPaused && (
        <button onClick={handleResume}>Resume</button>
      )}
      <button onClick={handleReset}>Reset</button>
    <div>
        <button onClick={addOneHour}>Add One Hour</button>
    </div>
    </div>
  );
};

export default CountdownComplite;