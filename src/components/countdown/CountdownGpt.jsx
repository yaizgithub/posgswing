import React, { useEffect, useState } from 'react'

const CountdownGpt = () => {
    const [countdownTime, setCountdownTime] = useState(3600); // 3600 seconds = 1 hour
    const [timeLeft, setTimeLeft] = useState(countdownTime);

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
            } else {
                clearInterval(timer);
                // Do something when countdown reaches zero
            }
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, [timeLeft]);

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
            <button onClick={addOneHour}>Add One Hour</button>
        </div>
    )
}

export default CountdownGpt