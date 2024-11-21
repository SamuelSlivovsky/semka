import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import socketService from '../service/socketService.js';
import GetUserData from '../Auth/GetUserData.jsx';
import '../styles/chat.css';
import { Dialog } from 'primereact/dialog';
import AddUserForm from '../Forms/AddUserForm.jsx';
import ChatSettings from './ChatSettings.jsx';

const Messages = (props) => {
  const messagesEndRef = useRef([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState(null);
  const [mySocketId, setMySocketId] = useState('');
  const userDataHelper = GetUserData(localStorage.getItem('hospit-user'));
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [show, setShow] = useState(false);
  const [typers, setTypers] = useState([]);
  const [allowScroll, setAllowScroll] = useState(true);
  const [nextScrollLength, setNextScrollLength] = useState(0);
  const [base64Data, setBase64Data] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settingsShow, setSettingsShow] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      setAllowScroll(true);
      const token = localStorage.getItem('hospit-user');
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token,
        },
      };

      try {
        const response = await fetch(
          `/chat/spravy/${props.group.ID_SKUPINY}/${userDataHelper.UserInfo.userid}`,
          requestOptions
        );
        const data = await response.json();

        const updatedMessages = [];
        await Promise.all(
          data.map(async (item) => {
            const message = {
              content: item.SPRAVA,
              date: item.DATUM,
              sender: Number(item.USERID),
              type: 'text',
              fullName: item.MENO + ' ' + item.PRIEZVISKO,
              unformatedDate: new Date(item.UNFORMATTED_DATE),
              unreadId: item.unreadId,
              unreadUserId: item.unreadUserId,
              messageId: item.ID_SPRAVY,
            };

            if (item.HAS_OBRAZOK == 1) {
              try {
                const imageResponse = await fetch(
                  `/chat/obrazok/${item.ID_SPRAVY}`,
                  requestOptions
                );
                const blob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(blob);
                message.image = imageUrl;
              } catch (error) {
                console.error('Error fetching image:', error);
              }
            }

            updatedMessages.push(message);
          })
        );
        messagesEndRef.current = messagesEndRef.current.slice(0, data.length);
        setMessages(
          updatedMessages.sort(
            (a, b) => new Date(a.unformatedDate) - new Date(b.unformatedDate)
          )
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    checkIfAdmin();
  }, [props.group]);

  const checkIfAdmin = () => {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    };

    fetch(
      `/chat/jeAdmin/${userDataHelper.UserInfo.userid}/${props.group.ID_SKUPINY}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.ADMIN == 1));
  };

  useEffect(() => {
    const container = document.getElementById('chat-messages');
    if (messagesEndRef.current && allowScroll) {
      const unreadIndex = messages.findIndex(
        (message) =>
          message.unreadId &&
          message.unreadUserId == userDataHelper.UserInfo.userid
      );
      if (unreadIndex >= 0)
        messagesEndRef.current[unreadIndex]?.scrollIntoView();
      else {
        container.scrollTop = container.scrollHeight;
      }
    } else if (messagesEndRef.current && !allowScroll && nextScrollLength > 0) {
      messagesEndRef.current[nextScrollLength - 1]?.scrollIntoView();
    }
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    socketService.connect();
    socketService.on('yourSocketId', (socketId) => {
      setMySocketId(socketId);
    });

    socketService.on('newMessage', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, new: true },
      ]);
      setTypers(typers.filter((item) => item.id !== message.sender));
      if (message.sender !== userDataHelper.UserInfo.userid) {
        const token = localStorage.getItem('hospit-user');
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            userid: userDataHelper.UserInfo.userid,
            id_skupiny: props.group.ID_SKUPINY,
          }),
        };
        fetch('/api/chat/updateRead', requestOptions);
      }
    });

    socketService.on('isTyping', (data) => {
      if (data.id !== userDataHelper.UserInfo.userid) {
        setTypers((prevTypers) => {
          const existingIndex = prevTypers.findIndex(
            (typer) => typer.id === data.id
          );

          if (existingIndex !== -1) {
            const newTypers = [...prevTypers];
            newTypers[existingIndex] = data;
            return newTypers;
          } else {
            return [...prevTypers, data];
          }
        });
      }
    });

    const container = document.getElementById('chat-messages');
    const handleScroll = () => {
      const scrolledDown =
        container.scrollTop + container.clientHeight >= container.scrollHeight;
      if (scrolledDown) {
        const token = localStorage.getItem('hospit-user');
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            userid: userDataHelper.UserInfo.userid,
            id_skupiny: props.group.ID_SKUPINY,
          }),
        };
        fetch('/api/chat/updateRead', requestOptions);

        props.setGroups(
          props.groups.map((item) => {
            if (item.ID_SKUPINY == props.group.ID_SKUPINY)
              return { ...item, pocet: 0 };
            else return item;
          })
        );
      }
    };

    if (container) container.addEventListener('scroll', handleScroll);

    return () => {
      socketService.disconnect();
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = () => {
    setAllowScroll(true);
    socketService.emit(
      'sendMessage',
      newMessage == '' && image ? ' ' : newMessage,
      {
        userId: userDataHelper.UserInfo.userid,
        image: image,
      }
    );

    insertMessage(newMessage == '' && image ? ' ' : newMessage);
    setImage(null);
    setNewMessage('');
  };

  const insertMessage = async (message) => {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        userid: userDataHelper.UserInfo.userid,
        id_skupiny: props.group.ID_SKUPINY,
        sprava: message,
        datum: new Date().toLocaleString('en-GB').replace(',', ''),
        priloha: base64Data,
      }),
    };
    await fetch('/api/chat/add', requestOptions);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    socketService.emit('typing', {
      userId: userDataHelper.UserInfo.userid,
      isEmpty: e.target.value === '',
    });
  };

  const handleImageChange = (e) => {
    const file = e.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    customBase64Uploader(e);
  };

  const openImageInNewTab = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const isCurrentUser = (sender) => {
    return sender === userDataHelper.UserInfo.userid;
  };

  const addUser = () => {
    setShow(true);
  };

  const addChatUser = (user) => {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        userid: user.CISLO_ZAM,
        id_skupiny: props.group.ID_SKUPINY,
      }),
    };
    fetch('/api/chat/insertUser', requestOptions).then(() => setShow(false));
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {chooseButton}
        {cancelButton}
      </div>
    );
  };

  const handleTopScroll = async (e) => {
    const container = e.target;
    const scrolledToTop = container.scrollTop === 0;
    if (container.scrollTopMax - container.scrollTop > 300 && !showButton)
      setShowButton(true);
    else if (container.scrollTopMax == container.scrollTop)
      setShowButton(false);

    if (scrolledToTop && allowScroll && messages.length > 0)
      await fetchPreviousMessages();
    else if (!scrolledToTop) setAllowScroll(true);
  };

  const fetchPreviousMessages = async () => {
    setAllowScroll(false);
    setLoading(true);
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        id_skupiny: props.group.ID_SKUPINY,
        id_spravy: messages[0]?.messageId,
        userid: userDataHelper.UserInfo.userid,
      }),
    };

    fetch(`/api/chat/nextSpravy`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setNextScrollLength(data.length);
        data = data.map((item) => {
          return {
            content: item.SPRAVA,
            date: item.DATUM,
            sender: Number(item.USERID),
            type: 'text',
            fullName: item.MENO + ' ' + item.PRIEZVISKO,
            unformatedDate: new Date(item.UNFORMATED_DATE),
            unreadId: item.unreadId,
            unreadUserId: item.unreadUserId,
            messageId: item.ID_SPRAVY,
          };
        });
        data = [...data, ...messages];
        messagesEndRef.current = messagesEndRef.current.slice(0, data.length);
        setMessages(data);
        setLoading(false);
      });
  };

  const customBase64Uploader = async (event) => {
    // convert file to base64 encoded
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      setBase64Data(reader.result.substring(reader.result.indexOf(',') + 1));
    };
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          height: '40px',
          width: '100%',
          backgroundColor: 'rgb(174, 253, 243)',
          display: 'flex',
          alignItems: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          paddingLeft: '10px',
        }}
      >
        {props.group.NAZOV}
        <Button
          icon='pi pi-cog'
          style={{
            display: isAdmin ? '' : 'none',
            width: '30px',
            height: '30px',
            marginLeft: 'auto',
            marginRight: '10px',
          }}
          onClick={() => setSettingsShow(true)}
        />
      </div>
      <div style={{ position: 'relative' }}>
        {showButton ? (
          <Button
            label='Scroll down'
            icon='pi pi-chevron-down'
            iconPos='right'
            style={{
              position: 'absolute',
              bottom: 350,
              zIndex: 999,
              left: 290,
            }}
            onClick={() => {
              messagesEndRef.current[messages.length - 1]?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
          />
        ) : (
          ''
        )}
        <div
          className='chat-messages'
          style={{ position: 'relative' }}
          id='chat-messages'
          onScroll={(e) => handleTopScroll(e)}
        >
          {loading ? (
            <div
              style={{
                width: '100%',
                height: '600px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ProgressSpinner />
            </div>
          ) : (
            messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              return (
                <div
                  ref={(el) => (messagesEndRef.current[index] = el)}
                  key={message.messageId}
                  unredkey={message.unreadId}
                  className={`message-container  ${message.sender} `}
                >
                  {isCurrentUser(message.sender) ? (
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        rowGap: '8px',
                      }}
                    >
                      {index === 0 ||
                      (message.new &&
                        (message.unformatedDate - prevMessage.unformatedDate) /
                          (1000 * 60) >
                          5) ||
                      (index > 0 && prevMessage.sender !== message.sender) ||
                      (index > 0 &&
                        prevMessage.sender === message.sender &&
                        (message.unformatedDate - prevMessage.unformatedDate) /
                          (1000 * 60) >
                          5) ? (
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            fontSize: '12px',
                            marginLeft: 'auto',
                            marginRight: '16px',
                          }}
                        >
                          {message.new ? 'Teraz' : message.date}
                        </div>
                      ) : (
                        ''
                      )}
                      <div
                        className={`message ${
                          isCurrentUser(message.sender) ? 'current-user' : ''
                        }`}
                      >
                        <span
                          style={{
                            marginLeft: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                          }}
                        >
                          {message.content}
                          {message.image ? (
                            <img
                              height={'60px'}
                              width={'auto'}
                              loading='eager'
                              src={message.image}
                              alt='sent'
                              onClick={() => openImageInNewTab(message.image)}
                              className='image-preview'
                            />
                          ) : (
                            ''
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        rowGap: '8px',
                      }}
                    >
                      {index === 0 ||
                      (index > 0 && prevMessage.sender !== message.sender) ||
                      (index > 0 &&
                        prevMessage.sender === message.sender &&
                        (message.unformatedDate - prevMessage.unformatedDate) /
                          (1000 * 60) >
                          5) ? (
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            fontSize: '0.875rem',
                            alignItems: 'center',
                          }}
                        >
                          <b>{message.fullName}</b>
                          <span style={{ fontSize: '12px' }}>
                            {message.date}
                          </span>
                        </div>
                      ) : (
                        ''
                      )}
                      <div style={{ display: 'flex', width: '100%' }}>
                        <div
                          className={`avatar`}
                          style={{
                            backgroundColor: '#3498db',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          K
                        </div>
                        <div
                          className={`message ${
                            isCurrentUser(message.sender) ? 'current-user' : ''
                          }`}
                        >
                          <span
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            {message.content}{' '}
                            {message.image ? (
                              <img
                                height={'60px'}
                                width={'auto'}
                                loading='eager'
                                src={message.image}
                                alt='sent'
                                onClick={() => openImageInNewTab(message.image)}
                                className='image-preview'
                              />
                            ) : (
                              ''
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          {typers
            .filter((item) => !item.isEmpty)
            .map((item) => {
              return (
                <div key={'typing'} className={`message-container`}>
                  <div
                    className={`avatar`}
                    style={{ backgroundColor: '#3498db' }}
                  ></div>
                  <div className='typing-container'>
                    <div class='typing'>
                      <div class='dot'></div>
                      <div class='dot'></div>
                      <div class='dot'></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className='chat-input'>
          <div className='input-with-preview'>
            <InputText
              style={{
                width: '100%',
                marginBottom: '10px',
                resize: 'none',
              }}
              rows={5}
              onKeyDown={(e) => {
                if (e.code === 'Enter') sendMessage();
              }}
              placeholder='Napíš správu...'
              value={newMessage}
              onChange={handleInputChange}
            />
          </div>
          <FileUpload
            customUpload
            accept='image/*'
            chooseLabel='Vložiť'
            cancelLabel='Zrušiť'
            headerTemplate={headerTemplate}
            maxFileSize={3000000}
            onSelect={handleImageChange}
            uploadHandler={customBase64Uploader}
            style={{ marginBottom: '10px' }}
            emptyTemplate={<p className='m-0'>Potiahni súbory tu.</p>}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={sendMessage}
              style={{ width: '100px' }}
              label='Odoslať'
            ></Button>
            <Button
              onClick={addUser}
              style={{ width: 'fit-content' }}
              label='Pridať použivateľa'
              icon='pi pi-plus'
            ></Button>
          </div>
        </div>
      </div>
      <Dialog
        visible={show}
        onHide={() => setShow(false)}
        style={{ minWidth: '50%' }}
      >
        {' '}
        <AddUserForm onClick={addChatUser} />
      </Dialog>
      <Dialog
        visible={settingsShow}
        onHide={() => setSettingsShow(false)}
        style={{ minWidth: '50%' }}
      >
        <h1>Nastavenia</h1>
        <ChatSettings
          groupId={props.group.ID_SKUPINY}
          userid={userDataHelper.UserInfo.userid}
        />
      </Dialog>
    </div>
  );
};

export default Messages;
