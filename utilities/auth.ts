import bcrypt from "bcrypt";

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 14);
}

function generateToken() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 32) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function comparePassword(
  password: string | Buffer,
  hashPassowrd: string
) {
  //true or false
  return await bcrypt.compare(password, hashPassowrd);
}

export { hashPassword, generateToken, comparePassword };
