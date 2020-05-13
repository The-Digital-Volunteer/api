import HelpRequest from '../models/HelpRequest';
import User from '../models/User';

const HelpRequestController = () => {
  const register = async (req, res) => {
    const { body, authUser } = req;
    if (!User.isTheSame(body.fromUser, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const helpRequest = await HelpRequest.create(HelpRequest.parseHelpRequest(body));
      const output = await helpRequest.toJSON();
      return res.status(200).json(output);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Could not create HelpRequest' });
    }
  };

  const get = async (req, res) => {
    const { id } = req.params;
    try {
      const helpRequest = await HelpRequest.findOne({ where: { id } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'Bad Request: HelpRequest not found' });
      }
      const output = await helpRequest.toJSON();
      return res.status(200).json(output);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const update = async (req, res) => {
    const { id } = req.params;
    const { body, authUser } = req;
    try {
      let helpRequest = await HelpRequest.findOne({ where: { id } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'Bad Request: HelpRequest not found' });
      }
      if (!User.isTheSame(helpRequest.get('fromUser'), authUser) && !User.isAdmin(authUser)) {
        return res.status(401).json({ msg: 'Unauthorized' });
      }
      const updated = await HelpRequest.update(
        HelpRequest.parseHelpRequest(body),
        { where: { id } },
      );
      if (updated) {
        helpRequest = await HelpRequest.findOne({ where: { id } });
        const output = await helpRequest.toJSON();
        return res.status(200).json(output);
      }
      return res.status(404).json({ msg: 'Bad Request: HelpRequest not found' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const remove = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    try {
      const helpRequest = await HelpRequest.findOne({ where: { id } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'Bad Request: HelpRequest not found' });
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
    const { id } = req.params;
    const { body, authUser } = req;
    if (!User.isTheSame(body.userId, authUser) && !User.isAdmin(authUser)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
      const user = await User.findOne({ where: { id: body.userId } });
      if (!user) {
        return res.status(404).json({ msg: 'Bad Request: User not found' });
      }
      const updated = await HelpRequest.update({ assignedUser: body.userId }, { where: { id } });
      if (updated) {
        const helpRequest = await HelpRequest.findOne({ where: { id } });
        const output = await helpRequest.toJSON();
        return res.status(200).json(output);
      }
      return res.status(404).json({ msg: 'Bad Request: HelpRequest not found' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const changeStatus = async (helpRequestId, statusLevel, authUser, res) => {
    try {
      let helpRequest = await HelpRequest.findOne({ where: { helpRequestId } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'Bad Request: HelpRequest not found' });
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
        const output = await helpRequest.toJSON();
        return res.status(200).json(output);
      }
      return res.status(404).json({ msg: 'Bad Request: HelpRequest not found' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const assignAccept = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    // eslint-disable-next-line no-return-await
    return await changeStatus(id, HelpRequest.REQUEST_STATUS_ACCEPTED, authUser, res);
  };

  const markDone = async (req, res) => {
    const { id } = req.params;
    const { authUser } = req;
    // eslint-disable-next-line no-return-await
    return await changeStatus(id, HelpRequest.REQUEST_STATUS_DONE, authUser, res);
  };

  const searchInNeed = async (req, res) => {
    const { authUser } = req;
    const { latitude, longitude } = req.body;
    try {
      const helpRequests = await HelpRequest.searchForInNeed(latitude, longitude, authUser);
      const output = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const helpRequest of helpRequests) {
        // eslint-disable-next-line no-await-in-loop
        output.push(await helpRequest.toJSON());
      }
      return res.status(200).json(output);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const searchHelper = async (req, res) => {
    const { id } = req.params;
    try {
      const helpRequest = await HelpRequest.findOne({ where: { id } });
      if (!helpRequest) {
        return res.status(404).json({ msg: 'Bad Request: HelpRequest not found' });
      }
      const users = await User.searchForHelpers(
        helpRequest.get('locationLatitude'),
        helpRequest.get('locationLongitude'),
        helpRequest.get('helpType'),
      );
      const output = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const user of users) {
        // eslint-disable-next-line no-await-in-loop
        output.push(await user.toJSON());
      }
      return res.status(200).json(output);
    } catch (err) {
      console.log(err);
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

module.exports = HelpRequestController;
