import Ajv from 'ajv';

import User from '../models/User';
import authService from '../services/auth.service';
import {
  authRequest,
  registerRequest,
  updateRequest,
} from '../schemas/user';

const UserController = () => {
  const ajv = new Ajv({ useDefaults: true });

  const register = async (req, res) => {
    const valid = ajv.validate(registerRequest, req.body);
    if (!valid) {
      return res.status(400).json({ msg: 'Bad Request' });
    }
    try {
      req.body.token = authService(req.body.id || '');
      const user = await User.create(req.body);
      return res.status(201).json(user.toJSON());
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const auth = async (req, res) => {
    const valid = ajv.validate(authRequest, req.body);
    if (!valid) {
      return res.status(400).json({ msg: 'Bad Request' });
    }
    const { email, bankId, password } = req.body;
    let user;
    try {
      user = await User.findOne({
        where: { email, bankId },
      });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }

    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    const token = authService(user.getDataValue('id'));
    user.setDataValue('token', token);
    await user.save();
    return res.status(200).json(user.toJSON());
  };

  const logout = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    if (!User.isTheSame(id, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const updated = await User.update({ token: null }, { where: { id } });
      if (updated) {
        const user = await User.findOne({
          where: { id },
        });
        return res.status(200).json(user.toJSON());
      }
      return res.status(404).json({ msg: 'User not found' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const get = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    try {
      let user = null;
      if (!User.isTheSame(id, authUser) && !User.isAdmin(authUser)) {
        user = await User.scope('lite').findOne({ where: { id } });
      } else {
        user = await User.findOne({ where: { id } });
      }
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      return res.status(200).json(user.toJSON());
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const remove = async (req, res) => {
    const { id } = req.params;
    const { body, authUser } = req;
    if (!User.isTheSame(id, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    if (body.onlyDisable) {
      const user = await User.update({ status: -1 }, { where: { id } });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
    } else {
      const user = await User.findOne({
        where: { id },
      });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      await user.destroy();
    }

    return res.status(200).json({ id });
  };

  const update = async (req, res) => {
    const valid = ajv.validate(updateRequest, req.body);
    if (!valid) {
      return res.status(400).json({ msg: 'Bad Request' });
    }
    const { id } = req.params;
    const { body, authUser } = req;
    if (!User.isTheSame(id, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const updated = await User.update(body, { where: { id } });
      if (updated) {
        const user = await User.findOne({ where: { id } });
        return res.status(200).json(user);
      }
      return res.status(404).json({ msg: 'User not found' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    register,
    auth,
    logout,
    get,
    update,
    remove,
  };
};

module.exports = UserController();
