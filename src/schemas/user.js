const authRequest = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    bankId: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'bankId', 'password'],
  additionalProperties: false,
};

const updateRequest = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    bankId: { type: 'string' },
    phone: { type: 'string' },
    about: { type: 'string', maxLength: 2048 },
    avatar: { type: ['string', 'null'], maxLength: 1024 },
    status: { pattern: '^(-([1])|[0,1])$' },
    role: { enum: ['inneed', 'helper', 'admin'] },
    /* eslint-disable */
    locationLatitude: { pattern: '^[-]?\d*\.?\d*$' },
    locationLongitude: { pattern: '^[-]?\d*\.?\d*$' },
    /* eslint-enable */
    addressStreet: { type: 'string', maxLength: 1024 },
    addressPostalCode: { type: 'string' },
    addressCity: { type: 'string' },
    skills: { type: 'string', maxLength: 1024 },
  },
  required: ['email', 'bankId'],
  additionalProperties: false,
};

const registerRequest = {
  ...updateRequest,
  required: ['email', 'bankId', 'password'],
};
registerRequest.properties = {
  ...registerRequest.properties,
  password: { type: 'string' },
};

module.exports = {
  authRequest,
  registerRequest,
  updateRequest,
};
