import { Button, Space } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTimer } from 'react-timer-hook';


function MyTimer(props,{ expiryTimestamp }) {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });
    
    const [tambahJam, setTambahJam] = useState(0)
    const [isPlay, setisPlay] = useState(false)

    // useEffect(() => {
    //   setTambahJam(props.jmlJam)
    // }, [props.jmlJam])
    


    useEffect(() => {
        let waktu = `${hours}:${minutes}:${seconds}`;
    //   console.log({timer: waktu, tambahJam:tambahJam});
    if (isPlay) {
        if (tambahJam > 0 && waktu === "0:0:0") {
          onClickRestart();          
        }
        if (waktu === "0:0:0") {
            setisPlay(false);
        }        
    }
    }, [tambahJam, hours,minutes,seconds, isPlay])
    

    const addHour=()=>{
        setTambahJam(props.jmlJam);        
      }

      const onClickRestart=()=>{
        setisPlay(true)
         // Restarts to 5 minutes timer
         const time = new Date();
         time.setSeconds(time.getSeconds() + (tambahJam * 10));
         restart(time);
         setTambahJam(0);
      }



    return (


      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: '35px', marginBottom:"10px"}}>
        <p>
                {hours < 10 ? "0" + hours : hours}:
                {minutes < 10 ? "0" + minutes : minutes}:
                {seconds < 10 ? "0" + seconds : seconds}
            </p>
        </div>
        {/* <p>{isRunning ? 'Running' : 'Not running'}</p> */}
        <Space>
        {/* <Button onClick={start}>Start</Button>
        <Button onClick={pause}>Pause</Button>
        <Button onClick={resume}>Resume</Button> */}
        <Button onClick={onClickRestart}>Restart</Button>
        <Button onClick={addHour}>Add 1 hour</Button>

        </Space>
      </div>
    );
  }


const CountDownTimer = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 10); // 0 detik timer
    return (
      <div>
        <MyTimer expiryTimestamp={time} />
      </div>
    );
}

export default CountDownTimer