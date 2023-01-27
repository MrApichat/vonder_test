import { IUser, IUserDisplay } from "../model";

const changeUserModel = (user: IUser): IUserDisplay => {
  const display: IUserDisplay = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    citizenId: user.citizenId,
  };
  return display;
};

export { changeUserModel };
