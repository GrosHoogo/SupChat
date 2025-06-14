import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ChannelList from './ChannelList';
import CreateChannelModal from './CreateChannelModal';
import { fetchChannelsByWorkspace, createChannel, clearChannelsError } from './channelsSlice';

export default function ChannelsPage({ workspaceId }) {
  const dispatch = useDispatch();
  const { channels, loading, error } = useSelector(state => state.channels);
  const [showModal, setShowModal] = useState(false);

  // Charger les channels au chargement du composant et si workspaceId change
  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchChannelsByWorkspace(workspaceId));
    }
  }, [dispatch, workspaceId]);

  const handleCreateChannel = async (channelData) => {
    try {
      // Appeler la thunk pour créer le canal
      await dispatch(createChannel({ workspaceId, ...channelData })).unwrap();
      setShowModal(false);
    } catch (err) {
      console.error('Erreur création canal:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearChannelsError());
  };

  // 👉 Filtrage ici : seuls les canaux publics ou ceux où l'utilisateur est membre
  const filteredChannels = channels.filter(ch =>
    !ch.is_private || ch.is_member === true
  );

  return (
    <div style={{ display: 'flex' }}>
      <ChannelList
        channels={filteredChannels}
        onCreateChannelClick={() => setShowModal(true)}
      />
      {showModal && (
        <CreateChannelModal
          onCreateChannel={handleCreateChannel}
          onClose={handleCloseModal}
        />
      )}

      {loading && <p>Chargement des canaux...</p>}
      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
    </div>
  );
}
