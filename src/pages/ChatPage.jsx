import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../api/socket';
import styled from 'styled-components';

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
`;

const MessagesList = styled.ul`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  list-style: none;
  margin: 0;
`;

const MessageItem = styled.li`
  margin-bottom: 1rem;
`;

const InputContainer = styled.form`
  display: flex;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  margin-right: 1rem;
`;

const Button = styled.button`
  background-color: var(--main-color);
  color: white;
  border: none;
  padding: 0 1rem;
  border-radius: 4px;
`;

export default function ChatPage() {
  const { workspaceId, channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef();

  useEffect(() => {
    socket.auth = { workspaceId, channelId };
    socket.connect();

    socket.emit('join_channel', { workspaceId, channelId });

    socket.on('channel_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.emit('leave_channel', { workspaceId, channelId });
      socket.off('channel_message');
      socket.disconnect();
      setMessages([]);
    };
  }, [workspaceId, channelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    socket.emit('send_message', { workspaceId, channelId, text: input });
    setInput('');
  };

  return (
    <Container>
      <MessagesList>
        {messages.map((msg, idx) => (
          <MessageItem key={idx}>
            <strong>{msg.user}</strong>: {msg.text}
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
      </MessagesList>
      <InputContainer onSubmit={sendMessage}>
        <Input
          type="text"
          placeholder="Envoyer un message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <Button type="submit">Envoyer</Button>
      </InputContainer>
    </Container>
  );
}
