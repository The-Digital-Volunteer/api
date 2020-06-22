import Ajv from 'ajv';

import UserRating from '../models/UserRating';
import User from '../models/User';
import {
  registerRequest,
} from '../schemas/rating';

const UserRatingController = () => {
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
      const userRating = await UserRating.create(body);
      return res.status(201).json(userRating.toJSON());
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const created = async (req, res) => {
    const { userId } = req.params;
    const { authUser } = req;
    if (!User.isTheSame(userId, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const userRatings = await UserRating.findAll({ where: { fromUser: userId } });
      return res.status(200).json(userRatings);
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
      const userRatings = await UserRating.findAll({ where: { toUser: userId } });
      return res.status(200).json(userRatings);
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const pending = async (req, res) => {
    const { userId } = req.params;
    const { authUser } = req;
    if (!User.isTheSame(userId, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const pendingHelpers = await User.getPendingHelpers(userId);
      const pendingInneeds = await User.getPendingInneeds(userId);

      const output = { helpers: [], inneeds: [] };
      output.helpers = pendingHelpers;
      output.inneeds = pendingInneeds;

      return res.status(200).json(output);
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    register,
    created,
    received,
    pending,
  };
};

module.exports = UserRatingController();
