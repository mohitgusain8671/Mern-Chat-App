import Router from 'express';
import { createChannel, deleteChannel, getChannelMessages, getUserChannels, updateChannel } from '../controllers/channel.controller.js';
import authorize  from '../middleware/auth.middleware.js'

const channelRouter = Router();

channelRouter.post('/create-channel',authorize, createChannel);
channelRouter.get('/get-user-channels',authorize, getUserChannels);
channelRouter.get('/channel-messages/:channelId', authorize, getChannelMessages);
channelRouter.delete('/delete-channel', authorize, deleteChannel);
channelRouter.put('/edit-channel', authorize, updateChannel);


export default channelRouter; 