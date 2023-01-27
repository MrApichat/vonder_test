import { IRoom, IUser } from "./";

interface IBooking {
  _id?: object | string;
  user: IUser;
  room: IRoom;
  amount: number;
  totalPrice: number;
  status: "booked" | "leave" | "cancel";
}

export {IBooking}