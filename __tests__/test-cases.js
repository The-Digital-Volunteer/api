const user = {
  firstName: "FirstName",
  lastName: "LastName",
  email: "name@mail.com",
  bankId: "name@mail.com",
  phone: "123456789",
  skills: "driver|picker|shopper", // pipe-separeted list of skills: driver|picker|shopper|walker|artist|inmune
  role: "helper",
  status: 0,
  about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  addressStreet: "Avda Random 125, 3B",
  addressPostalCode: "28044",
  addressCity: "Madrid",
  locationLatitude: 40.3825075,
  locationLongitude: -3.7782882,
};

const rating = {
	fromUser: null,
	toUser: null,
	value: null,
	comment: null
};

const message = {
  fromUser: null,
  toUser: null,
  helpRequest: null,
  title: null,
  content: null
};

const helpRequest = {
  fromUser: null,
  assignedUser: null,
  description: "description",
  priority: 1,
  status: 0,
  locationLatitude: 40.3825075,
  locationLongitude: -3.7782882,
  helpType: "groceries",
  timeOptions: "10:00-11:00",
  deliveryOption: "door",
  paymentOption: "cash"
};

const createUser = async (request, payload) => {
  const newUser = {
    ...user,
    ...payload
  };
  const { body: { id: userId } } = await request.post(`/users`).send(newUser);
  return { userId };
};

const authorizeUser = async (request, payload) => {
  const { body: { token } } = await request.post(`/users/auth`).send(payload);
  return { token };
};

const createAndAuthorizeUsers = async (request, size) => {
  const keys = new Array(size);
  keys.fill("");

  return Promise.all(keys.map(async key => {
    const timestamp = new Date().getTime();
    const payload = {
      email: `${timestamp}@mail.com`,
      bankId: `bank_${timestamp}`,
      password: `${timestamp}`
    };
    const { userId } = await createUser(request, payload);
    const { token } = await authorizeUser(request, payload);
    return { key, userId, token };
  }));
};

module.exports = {
  user,
  rating,
  message,
  helpRequest,
  createAndAuthorizeUsers,
};
