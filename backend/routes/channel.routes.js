import Router from 'express';
import { createChannel, getChannelMessages, getUserChannels } from '../controllers/channel.controller.js';
import authorize  from '../middleware/auth.middleware.js'

const channelRouter = Router();

channelRouter.post('/create-channel',authorize, createChannel);
channelRouter.get('/get-user-channels',authorize, getUserChannels);
channelRouter.get('/channel-messages/:channelId', authorize, getChannelMessages);


export default channelRouter; 