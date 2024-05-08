import { Button, Input } from 'antd';
import React, { useState } from 'react'

const CountdownContoh = () => {

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [timer, setTimer] = useState(0);
    const [timeInterval, setTimeInterval] = useState(null);


    const onChangeInput=(e)=>{
        setTimer(e.target.value);
    }

    const handleTimer=(countDownTime)=>{
        var now = new Date().getTime();
        var interval = countDownTime - now;
        if (interval > 0) {
            setHours(Math.floor((interval / (1000 * 60 * 60)) % 24));
            setMinutes(Math.floor((interval / 1000 / 60) % 60));
            setSeconds(Math.floor((interval / 1000) % 60));
        }
    }

    const onClickStart=()=>{
        var countDownTime = Date.now() + timer * 1000;
        setTimeInterval(
            setInterval(handleTimer,1000,countDownTime));        
    }

  return (
     
    <div>
        <Input onChange={onChangeInput}/>
        <Button onClick={onClickStart}>Start</Button>
        {hours}:{minutes}:{seconds}</div>
  )
}

export default CountdownContoh