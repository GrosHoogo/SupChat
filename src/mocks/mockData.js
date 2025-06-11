// src/mocks/mockData.js

export const users = [
  {
    id: 1,
    username: 'alice',
    displayName: 'Alice Dupont',
    email: 'alice@example.com'
  },
  {
    id: 2,
    username: 'bob',
    displayName: 'Bob Martin',
    email: 'bob@example.com'
  }
];

export const workspaces = [
  {
    id: 1,
    name: 'Équipe Produit',
    members: [1, 2],
    channels: [1, 2]
  }
];

export const channels = [
  {
    id: 1,
    workspaceId: 1,
    name: 'général',
    isPrivate: false,
    messages: [
      {
        id: 1,
        userId: 1,
        content: 'Bienvenue sur le canal #général !',
        timestamp: '2025-06-11T08:00:00Z'
      }
    ]
  },
  {
    id: 2,
    workspaceId: 1,
    name: 'dev-privé',
    isPrivate: true,
    members: [1], // ids d'utilisateur autorisés
    messages: []
  }
];

export const messages = [
  {
    id: 1,
    channelId: 1,
    userId: 1,
    content: 'Ceci est un message de test.',
    timestamp: '2025-06-11T10:00:00Z'
  }
];
