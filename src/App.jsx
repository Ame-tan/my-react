import { useState, useEffect } from "react";
import React from "react";
import styled from "styled-components";
//import PropTypes from 'prop-types'

const API_ENDPOINT = "https://student-json-api.lidemy.me/comments";

const Page = styled.div`
  width: 360px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
`;

const MessageForm = styled.form`
  margin-top: 16px;
`;

const MessageTextArea = styled.textarea`
  display: block;
  width: 100%;
`;
const SubmitButton = styled.button`
  margin-top: 8px;
`;

const MessageList = styled.div`
  margin-top: 16px;
`;

const MessageContainer = styled.div`
  border: 1px solid black;
  padding: 8px 16px;
  border-radius: 8px;
  & + & {
    margin-top: 8px;
  }
`;

const MessageHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #b6b6b6;
  padding-bottom: 4px;
`;

const MessageAuthor = styled.div`
  color: #400f0f;
  font-size: 14px;
`;

const MessageTime = styled.div`
  font-size: 14px;
`;

const MessageBody = styled.div`
  margin-top: 16px;
  font-size: 16px;
`;
const ErrrorMessage = styled.div`
  margin-top: 16px;
  color: red;
`;

const Loading =styled.div`  //Loading的遮罩樣式
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0, 0, 0 ,0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`

function Message({ author, time, children }) {
  return (
    <MessageContainer>
      <MessageHead>
        <MessageAuthor>{author}</MessageAuthor>
        <MessageTime>{time}</MessageTime>
      </MessageHead>

      <MessageBody>{children}</MessageBody>
    </MessageContainer>
  );
}

// Message.propTypes = {
//   author : PropTypes.string,
//   time  :PropTypes.string,
//   children: PropTypes.node,
// }

function App() {

  //刪除的方法
  // const commentId = '43';
  // const apiUrl = `https://student-json-api.lidemy.me/comments/${commentId}`;

  
  // fetch(apiUrl, {
  //   method: 'DELETE',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  // .then(response => response.json())
  // .then(data => {
  //   if (data.success) {
  //     console.log('留言已成功刪除');
  //   } else {
  //     console.log('刪除留言失敗:', data.message);
  //   }
  // })
  // .catch(error => {
  //   console.error('錯誤:', error);
  // });


  const [messages, setMessages] = useState([]);
  const [MessageApiErrror, setMessageApiError] = useState(null);

  const [value , setValue] = useState();

  const [postMessageError, setPostMessageError]= useState();

  const[isLoadingPostMessage,setIsLoadingPostMessage]=useState(false)


  const fetchMessages = ()=>{
    return  fetch(API_ENDPOINT)
    .then((res) => res.json())
    .then((data) => {
      const sortedMessages = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));//讓最新的留言加入在最上面
      setMessages(sortedMessages);
    })
    .catch((err) => {
      setMessageApiError(err.message);
    });
  }

  const handleTextareaChange = (e) =>{
    setValue(e.target.value)
  }

  const handleTextareaFocus = ()=>{  //讓沒有內容時送出留言的失敗消息在點擊留言處的時候就消失 +onFocus
    setPostMessageError(null) 
  }

  const handleFormSubmit = (e) =>{
    e.preventDefault();  //取消送出預設的重整頁面  要放最前面 
    if(isLoadingPostMessage){
      return
    }
    setIsLoadingPostMessage(true)
    fetch('https://student-json-api.lidemy.me/comments', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        nickname: 'Ame',
        body: value,
      })
    })
    .then(res => res.json())
    .then(data => {
      setIsLoadingPostMessage(false)
      if (data.ok === 0){
        setPostMessageError(data.message)
        return;
      }
      setValue('');
      fetchMessages()
    }).catch(err=>{
      setIsLoadingPostMessage(false)
      setPostMessageError(err.message)
    })
  }

  useEffect(() => {
    fetchMessages()
  }, []);

  return (
   <Page> 
      {isLoadingPostMessage && <Loading>Loading...</Loading>}
      <Title>留言板</Title>

      <MessageForm  onSubmit={handleFormSubmit}>
        <MessageTextArea value={value}  onChange={handleTextareaChange} 
                                        onFocus={handleTextareaFocus}   rows={10} />
        <SubmitButton>送出留言</SubmitButton>
        {postMessageError && <ErrrorMessage>{postMessageError}</ErrrorMessage>}
      </MessageForm >
      {MessageApiErrror && (
        <ErrrorMessage>
          Something went worng. {MessageApiErrror.toString()}
        </ErrrorMessage>
      )}
      {messages && messages.length === 0 && <div>NO Message</div>}
      <MessageList>
        {messages  &&  messages.map((message) => (
          <Message
            key={message.id}
            author={message.nickname}
            time={new Date(message.createdAt).toLocaleString()}
          >
            {message.body}
          </Message>
        ))}
      </MessageList>
    </Page>
  );
}

export default App;
