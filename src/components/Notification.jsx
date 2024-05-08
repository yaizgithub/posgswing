import React, { useState } from 'react';
import {requestForToken, onMessageListener} from '../firebase'
import { notification } from 'antd';

const Notification = () => {
    const [api, contextHolder] = notification.useNotification();
    const [notification, setNotification] = useState({title:'', body:''});

    const openNotification = (message,description) => {
        api.info({
            message: message,
            description: description,
            placement: "topRight",
        });
    };

    requestForToken();

    onMessageListener().then((payload)=>{
        setNotification({title:payload?.notification?.title, body:payload?.notification?.body});
    }).catch((err)=>console.log('onMessageListener - Notification',err));    

  return (
    <div>
        {contextHolder}
        {openNotification(notification.title, notification.body)}
    </div>
  )
}
;
export default Notification;