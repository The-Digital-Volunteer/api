import Ajv from 'ajv';

import HelpRequest from '../models/HelpRequest';
import User from '../models/User';
import {
  searchInNeedRequest,
  registerRequest,
  assignRequest,
} from '../schemas/help-request';

const REQUEST_STATUS_INIT = 0;
const REQUEST_STATUS_ACCEPTED = 1;
const REQUEST_STATUS_DONE = 2;

const HELP_TYPE_SHOP = 'groceries';
const HELP_TYPE_TRANSPORT = 'transport';
const HELP_TYPE_MEDICINE = 'medicine';
const HELP_TYPE_OTHER = 'other';

const DELIVERY_DOOR = 'door';
const DELIVERY_PORCH = 'porch';
const DELIVERY_DRONE = 'drone';

const DELIVERY_CASH = 'cash';
const DELIVERY_CARD = 'card';
const DELIVERY_SWISH = 'swish';

const ROLE_HELPER = 'helper';
const ROLE_INNEED = 'inneed';
const ROLE_ADMIN = 'admin';
const SKILL_DRIVER = 'driver';
const SKILL_PICKER = 'picker';
const SKILL_SHOPPER = 'shopper';

const HelpRequestController = () => {
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
      const helpRequest = await HelpRequest.create(body);
      return res.status(201).json(helpRequest.toJSON());
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const get = async (req, res) => {
    const { id } = req.params;
    try {
      const helpRequest = await HelpRequest.findOne({ where: { id } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'HelpRequest not found' });
      }
      return res.status(200).json(helpRequest.toJSON());
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const update = async (req, res) => {
    const valid = ajv.validate(registerRequest, req.body);
    if (!valid) {
      return res.status(400).json({ msg: 'Bad Request' });
    }
    const { id } = req.params;
    const { body, authUser } = req;
    try {
      let helpRequest = await HelpRequest.findOne({ where: { id } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'HelpRequest not found' });
      }
      if (!User.isTheSame(helpRequest.get('fromUser'), authUser) && !User.isAdmin(authUser)) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }
      await HelpRequest.update(body, { where: { id } });
      helpRequest = await HelpRequest.findOne({ where: { id } });
      return res.status(200).json(helpRequest.toJSON());
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const remove = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    try {
      const helpRequest = await HelpRequest.findOne({ where: { id } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'HelpRequest not found' });
      }
      if (!User.isTheSame(helpRequest.get('fromUser'), authUser) && !User.isAdmin(authUser)) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }
      await helpRequest.destroy();
      return res.status(200).json({ id });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const assign = async (req, res) => {
    const valid = ajv.validate(assignRequest, req.body);
    if (!valid) {
      return res.status(400).json({ msg: 'Bad Request' });
    }
    const { id } = req.params;
    const { body, authUser } = req;
    if (!User.isTheSame(body.userId, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const user = await User.findOne({ where: { id: body.userId } });
      if (!user) return res.status(404).json({ msg: 'User not found' });

      let helpRequest = await HelpRequest.findOne({ where: { id } });
      if (!helpRequest) return res.status(404).json({ msg: 'HelpRequest not found' });

      const updated = await HelpRequest.update({ assignedUser: body.userId }, { where: { id } });
      if (updated) {
        helpRequest = await HelpRequest.findOne({ where: { id } });
        return res.status(200).json(helpRequest.toJSON());
      }
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const changeStatus = async (helpRequestId, statusLevel, authUser, res) => {
    try {
      let helpRequest = await HelpRequest.findOne({ where: { id: helpRequestId } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'HelpRequest not found' });
      }
      if (!User.isTheSame(helpRequest.get('fromUser'), authUser)
          && !User.isTheSame(helpRequest.get('assignedUser'), authUser)
          && !User.isAdmin(authUser)) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }
      const updated = await HelpRequest.update(
        { status: statusLevel },
        { where: { id: helpRequestId } },
      );
      if (updated) {
        helpRequest = await HelpRequest.findOne({ where: { id: helpRequestId } });
        return res.status(200).json(helpRequest.toJSON());
      }
      return res.status(404).json({ msg: 'HelpRequest not found' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const assignAccept = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;

    return changeStatus(id, REQUEST_STATUS_ACCEPTED, authUser, res);
  };

  const markDone = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;

    return changeStatus(id, REQUEST_STATUS_DONE, authUser, res);
  };

  const searchInNeed = async (req, res) => {
    const valid = ajv.validate(searchInNeedRequest, req.body);
    if (!valid) {
      return res.status(400).json({ msg: 'Bad Request' });
    }
    const { authUser } = req;
    const { latitude, longitude } = req.body;
    try {
      const user = await User.findOne({ where: { id: authUser.id } });
      const helpRequests = await HelpRequest.searchForInNeed(latitude, longitude, user);
      return res.status(200).json(helpRequests);
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const searchHelper = async (req, res) => {
    const { id } = req.params;
    try {
      const helpRequest = await HelpRequest.findOne({ where: { id } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'HelpRequest not found' });
      }
      const users = await User.searchForHelpers(
        helpRequest.get('locationLatitude'),
        helpRequest.get('locationLongitude'),
        helpRequest.get('helpType'),
      );
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    register,
    get,
    update,
    remove,
    assign,
    assignAccept,
    markDone,
    searchInNeed,
    searchHelper,
  };
};

module.exports = HelpRequestController();
