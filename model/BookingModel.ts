import { IRoom, IUserDisplay } from "./";

interface IBooking {
  _id?: object | string;
  user: IUserDisplay;
  room: IRoom;
  amount: number;
  totalPrice: number;
  status: "booked" | "leave" | "cancel";
}

export {IBooking}