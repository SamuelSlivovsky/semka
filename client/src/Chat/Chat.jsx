import React, { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import Messages from './Messages.jsx';
import GetUserData from '../Auth/GetUserData.jsx';
import '../styles/chat.css';
const Chat = () => {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const userDataHelper = GetUserData(localStorage.getItem('hospit-user'));

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('hospit-user'),
      },
    };
    fetch(`/api/chat/groups/${userDataHelper.UserInfo.userid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setGroups(
          data.map((item) => {
            return (
              <div
                style={{
                  backgroundColor: `#1ecbe1`,
                  height: '40px',
                  width: '40px',
                  marginTop: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '20px',
                  position: 'relative',
                }}
                onClick={() => setGroup(item)}
              >
                <p>{item.NAZOV[0]}</p>
                {item.POCET > 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      left: '25px',
                      display: 'inline-block',
                      padding: '0 4px',
                      minWidth: '8px',
                      maxWidth: '18px',
                      height: '16px',
                      borderRadius: '22px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '400',
                      lineHeight: '16px',
                      backgroundColor: '#c00',
                      color: '#fff',
                      zIndex: 9999,
                    }}
                  >
                    {item.POCET}
                  </div>
                ) : (
                  ''
                )}
              </div>
            );
          })
        );
        setLoading(false);
      });
  }, []);

  return (
    <div className='chat-container'>
      <div
        style={{
          width: '100px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#aefdf3',
          alignItems: 'center',
        }}
      >
        {loading ? <ProgressSpinner /> : groups}
      </div>
      {group ? (
        <Messages group={group} setGroups={setGroups} groups={groups} />
      ) : (
        'Vyber skupinu'
      )}
    </div>
  );
};

export default Chat;
