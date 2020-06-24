const registerRequest = {
  type: 'object',
  properties: {
    fromUser: { type: 'integer' },
    toUser: { type: 'integer' },
    helpRequest: { type: 'integer' },
    title: { type: 'string', maxLength: 1024 },
    content: { type: 'string', maxLength: 4096 },
  },
  required: ['fromUser', 'toUser', 'helpRequest', 'title', 'content'],
  additionalProperties: false,
};

module.exports = {
  registerRequest,
};
