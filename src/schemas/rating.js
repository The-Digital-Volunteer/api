const registerRequest = {
  type: 'object',
  properties: {
    fromUser: { type: 'integer' },
    toUser: { type: 'integer' },
    value: { type: 'integer', minimum: 0, maximum: 10 },
    comment: { type: 'string', maxLength: 2048 },
  },
  required: ['fromUser', 'toUser', 'value', 'comment'],
  additionalProperties: false,
};

module.exports = {
  registerRequest,
};
