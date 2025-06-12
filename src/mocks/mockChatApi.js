// src/mocks/mockChatApi.js

let messages = [
  {
    id: '1',
    userId: 'user2',
    text: 'Salut !',
    reactions: ['👍'],
  },
  {
    id: '2',
    userId: 'user1',
    text: 'Hey ! Comment ça va ?',
    reactions: [],
  },
];

export async function fetchMockMessages() {
  return new Promise(resolve => {
    setTimeout(() => resolve([...messages]), 300);
  });
}

export async function sendMockMessage(userId, text) {
  return new Promise(resolve => {
    const newMessage = {
      id: Date.now().toString(),
      userId,
      text,
      reactions: [],
    };
    messages.push(newMessage);
    setTimeout(() => resolve(newMessage), 200);
  });
}

export async function reactToMockMessage(messageId, reaction) {
  return new Promise(resolve => {
    messages = messages.map(m =>
      m.id === messageId
        ? { ...m, reactions: [...m.reactions, reaction] }
        : m
    );
    const updated = messages.find(m => m.id === messageId);
    setTimeout(() => resolve({ ...updated }), 150);
  });
}
