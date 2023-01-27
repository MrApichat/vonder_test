import { client } from "../database";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { IBooking, IRoom } from "../model";
import { validationResult } from "express-validator";
import { validateError } from "../utilities/error";

class BookingController {
  constructor() {}

  public async bookingRoom(req: Request, res: Response) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).send({
          success: false,
          message: validateError(error),
        });
      }
      if (!req.body.isLogin)
        return res.status(401).send({
          success: false,
          message: "Login required",
        });

      const roomId = req.params.id;
      await client.connect();
      const room: IRoom | null = (await client
        .db("test")
        .collection("restRoom")
        .findOne({ _id: new ObjectId(roomId) })) as IRoom;

      if (!room)
        return res.status(400).send({
          success: false,
          message: "Hotel not found.",
        });
      if (!room.isActive)
        return res.status(400).send({
          success: false,
          message: "This hotel is unavailable.",
        });
      if (!room.left) {
        return res.status(400).send({
          success: false,
          message: "This hotel is full.",
        });
      }
      room.left = room.left - req.body.amount;
      let booking: IBooking = {
        user: req.body.user,
        room: room,
        amount: req.body.amount,
        totalPrice: req.body.amount * room.price,
        status: "booked",
      };

      const insert = await client.db("test").collection("booking").insertOne({
        userId: booking.user._id,
        roomId: booking.room._id,
        amount: booking.amount,
        totalPrice: booking.totalPrice,
        status: booking.status,
      });

      booking._id = insert.insertedId;

      await client
        .db("test")
        .collection("restRoom")
        .updateOne(
          { _id: booking.room._id },
          {
            $set: {
              left: booking.room.left,
            },
          }
        );

      await client.close();

      return res.status(200).send({ success: true, data: booking });
    } catch (err: any) {
      return res.status(500).send({ success: false, message: err.message });
    }
  }

}

export default BookingController;
