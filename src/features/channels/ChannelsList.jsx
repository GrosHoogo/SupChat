import React from 'react';

export default function ChannelList({ channels, onCreateChannelClick, onSelectChannel, selectedChannelId }) {
  return (
    <div style={{ padding: '1rem', borderRight: '1px solid #ccc', width: '250px', overflowY: 'auto' }}>
      <h3>Canaux</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {channels.map(ch => (
          <li
            key={ch.id}
            style={{
              padding: '0.5rem 0',
              cursor: 'pointer',
              fontWeight: ch.id === selectedChannelId ? 'bold' : 'normal',
              backgroundColor: ch.id === selectedChannelId ? '#ddd' : 'transparent',
              borderRadius: '4px',
              userSelect: 'none',
            }}
            onClick={() => onSelectChannel(ch.id)}
          >
            # {ch.name}
          </li>
        ))}
      </ul>
      <button onClick={onCreateChannelClick} style={{ marginTop: '1rem', width: '100%' }}>
        + Créer un canal
      </button>
    </div>
  );
}
