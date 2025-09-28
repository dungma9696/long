const bcrypt = require('bcrypt');

const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    throw new Error(error);
  }
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hash: string,
) => {
  try {
    return await bcrypt.compare(plainPassword, hash);
  } catch (error) {
    throw new Error(error);
  }
};
