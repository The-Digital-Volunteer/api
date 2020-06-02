import UserRating from '../models/UserRating';
import User from '../models/User';

const UserRatingController = () => {
  const register = async (req, res) => {
    const { body, authUser } = req;
    if (!User.isTheSame(body.fromUser, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const userRating = await UserRating.create(body);
      const output = await userRating.toJSON();
      return res.status(200).json(output);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Could not create UserRating' });
    }
  };

  const created = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    if (!User.isTheSame(id, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const userRatings = await UserRating.findAll({ where: { fromUser: id } });
      const output = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const rating of userRatings) {
        // eslint-disable-next-line no-await-in-loop
        output.push(await rating.toJSON());
      }
      return res.status(200).json(output);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const received = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    if (!User.isTheSame(id, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const userRatings = await UserRating.findAll({ where: { toUser: id } });
      const output = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const rating of userRatings) {
        // eslint-disable-next-line no-await-in-loop
        output.push(await rating.toJSON());
      }
      return res.status(200).json(output);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const pending = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    if (!User.isTheSame(id, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const pendingHelpers = await User.getPendingHelpers(id);
      const pendingInneeds = await User.getPendingInneeds(id);

      const output = { helpers: [], inneeds: [] };

      // eslint-disable-next-line no-restricted-syntax
      for (const user of pendingHelpers) {
        // eslint-disable-next-line no-await-in-loop
        output.helpers.push(await user.toJSON());
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const user of pendingInneeds) {
        // eslint-disable-next-line no-await-in-loop
        output.inneeds.push(await user.toJSON());
      }

      return res.status(200).json(output);
    } catch (err) {
      console.error(err);
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

module.exports = UserRatingController;
