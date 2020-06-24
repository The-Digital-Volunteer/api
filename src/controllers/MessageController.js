import Ajv from 'ajv';

import Message from '../models/Message';
import User from '../models/User';
import {
  registerRequest,
} from '../schemas/message';

const MessageController = () => {
  const ajv = new Ajv({ useDefaults: true });

  const register = async (req, res) => {
    const valid = ajv.validate(registerRequest, req.body);
    if (!valid) {
      return res.status(400).json({ msg: 'Bad Request' });
    }
    const { body, authUser } = req;
    if (!User.isTheSame(body.fromUser, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const message = await Message.create(body);
      return res.status(201).json(message.toJSON());
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const get = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    try {
      const message = await Message.findOne({ where: { id } });
      if (!message) {
        return res.status(404).json({ msg: 'Message not found' });
      }
      if (!User.isTheSame(message.get('fromUser'), authUser)
          && !User.isTheSame(message.get('toUser'), authUser)
          && !User.isAdmin(authUser)) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }
      const output = await message.toJSON();
      return res.status(200).json(output);
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const remove = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    try {
      const message = await Message.findOne({ where: { id } });
      if (!message) {
        return res.status(404).json({ msg: 'Bad Request: Message not found' });
      }
      if (!User.isTheSame(message.get('fromUser'), authUser)
          && !User.isTheSame(message.get('toUser'), authUser)
          && !User.isAdmin(authUser)) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }
      await message.destroy();
      return res.status(200).json({ id });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const sent = async (req, res) => {
    const { userId } = req.params;
    const { authUser } = req;
    if (!User.isTheSame(userId, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const messages = await Message.findAll({ where: { fromUser: userId } });
      return res.status(200).json(messages);
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const received = async (req, res) => {
    const { userId } = req.params;
    const { authUser } = req;
    if (!User.isTheSame(userId, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const messages = await Message.findAll({ where: { toUser: userId } });
      return res.status(200).json(messages);
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    register,
    get,
    remove,
    sent,
    received,
  };
};

module.exports = MessageController();
