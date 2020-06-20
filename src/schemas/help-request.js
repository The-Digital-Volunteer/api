const assignRequest = {
  type: 'object',
  properties: {
    userId: { type: 'integer' },
  },
  required: ['userId'],
  additionalProperties: false,
};

const searchInNeedRequest = {
  type: 'object',
  properties: {
    latitude: { pattern: '^[-]?\d*\.?\d*$' },
    longitude: { pattern: '^[-]?\d*\.?\d*$' },
  },
  required: ['latitude', 'longitude'],
  additionalProperties: false,
};

const registerRequest = {
  type: 'object',
  properties: {
    fromUser: { type: 'integer' },
    assignedUser: { type: 'integer' },
    description: { type: 'string', maxLength: 4096 },
    priority: { type: 'integer', default: 1 },
    status: {
      type: 'integer', minimum: 0, maximum: 2, default: 0,
    },
    locationLatitude: { pattern: '^[-]?\d*\.?\d*$' },
    locationLongitude: { pattern: '^[-]?\d*\.?\d*$' },
    helpType: { enum: ['groceries', 'transport', 'medicine', 'other'] },
    timeOptions: { type: 'string', maxLength: 4096 },
    deliveryOption: { enum: ['door', 'porch', 'drone'] },
    paymentOption: { enum: ['cash', 'card', 'swish'] },
  },
  required: [
    'fromUser',
    'assignedUser',
    'description',
    'priority',
    'status',
    'locationLatitude',
    'locationLongitude',
    'helpType',
    'timeOptions',
    'deliveryOption',
    'paymentOption',
  ],
  additionalProperties: false,
};

module.exports = {
  assignRequest,
  searchInNeedRequest,
  registerRequest,
};
