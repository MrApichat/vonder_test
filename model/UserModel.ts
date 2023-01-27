interface IUser extends IUserDisplay {
  token: string;
  password: string;
}

interface IUserDisplay {
  _id: object | string;
  name: string;
  email: string;
  phone: string;
  citizenId: string;
}

export { IUser, IUserDisplay };
