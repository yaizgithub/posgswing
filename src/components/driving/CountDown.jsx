import React, { useEffect, useState } from 'react'
import { useWaktuServerData } from '../../hooks/useWaktuServer';
import dayjs from "dayjs";
import { Button, Space } from "antd";


////  https://www.youtube.com/watch?v=AIfUvtci-vo

const CountDown = () => {



    const [days, setDays] = useState(0);
    const [hour, setHours] = useState(0);
    const [mins, setMinutes] = useState(0);
    const [secs, setSeconds] = useState(0);
    const [play, setPlay] = useState(false);

    ///HOOKs
    const {data, isLoading, isError, error} = useWaktuServerData();


    const deadline = "2024/01/26 12:00:00";

    const getTime=()=>{
        // const time = Date.parse(deadline) - dayjs(data.waktuserver).format("YYYY-MM-DD"); 
        const time = Date.parse(deadline) - Date.now();
        setDays(Math.floor(time/(1000*60*60*24)));
        setHours(Math.floor(time/(1000*60*60)%24));
        setMinutes(Math.floor((time/1000/60)%60));
        setSeconds(Math.floor((time/1000)%60));        
    }

    useEffect(() => {
      const interval = setInterval(() => {
        if (play) {
            getTime(deadline)            
        }
      }, 1000);
    
      return () => {
        clearInterval(interval)
      }
    }, [play])
    

const onClickPlay=()=>{
    setPlay(true);
}

  return (
    <div>
    <span className='mr-3'>
        <Button onClick={onClickPlay}>Play</Button>

    </span>
        <Space>
        {/* {days < 10 ? "0"+days: days} */}
        {hour < 10 ? "0"+hour: hour}
        {mins < 10 ? "0"+mins: mins}
        {secs < 10 ? "0"+secs: secs}

        </Space>
    </div>
  )
}

export default CountDown