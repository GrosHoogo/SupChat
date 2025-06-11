import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels } from '../features/channels/channelSlice';
import { Link, useParams } from 'react-router-dom';

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  const { channels, loading, error } = useSelector(state => state.channels);

  useEffect(() => {
    dispatch(fetchChannels(workspaceId));
  }, [workspaceId, dispatch]);

  if(loading) return <p>Chargement...</p>;
  if(error) return <p>Erreur: {error}</p>;

  return (
    <div>
      <h2>Channels</h2>
      <ul>
        {channels.map(channel => (
          <li key={channel.id}>
            <Link to={`/workspace/${workspaceId}/channel/${channel.id}`}>{channel.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
