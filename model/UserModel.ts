interface UserModel {
  _id: object | string;
  name: string;
  email: string;
  phone: string;
  citizenId: string;
  token: string;
  password: string;
}

export { UserModel };
