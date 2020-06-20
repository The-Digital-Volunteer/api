const authService = (id) => `${Math.floor(Date.now() / 1000)}${process.env.SECRET}${id}`;

export default authService;
