import { genSaltSync, hashSync, compareSync } from 'bcrypt-nodejs';

const bcryptService = () => {
  const password = (user) => {
    const salt = genSaltSync();
    const hash = hashSync(user.password, salt);

    return hash;
  };

  const hash = (text) => {
    const salt = genSaltSync();
    const hashed = hashSync(text, salt);

    return hashed;
  };

  const comparePassword = (pw, hashPw) => (
    compareSync(pw, hashPw)
  );

  return {
    password,
    hash,
    comparePassword,
  };
};

export default bcryptService;
