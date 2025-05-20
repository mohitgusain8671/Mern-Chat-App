import Router from 'express';
import { createChannel, getUserChannels } from '../controllers/channel.controller.js';
import authorize  from '../middleware/auth.middleware.js'

const channelRouter = Router();

channelRouter.post('/create-channel',authorize, createChannel);
channelRouter.get('/get-user-channels',authorize, getUserChannels);


export default channelRouter; 