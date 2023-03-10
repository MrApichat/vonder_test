import { client } from "../database";
import { Request, Response } from "express";
import { IRoom } from "../model";

class RoomController {
  constructor() {}

  public async getRoom(req: Request, res: Response) {
    try {
      let filter: {
        [key: string]: any;
      } = {};
      if (req.query?.isActive) {
        filter.isActive = req.query.isActive == "true";
      }
      if (req.query.keyword) {
        filter.name = {
          $regex: new RegExp(`${req.query.keyword}`),
          $options: "i",
        };
      }
      if (req.query.roomLeft && !isNaN(req.query.roomLeft as any)) {
        filter.left = { $gte: +req.query.roomLeft };
      }
      if (req.query.priceStart && !isNaN(req.query.priceStart as any)){
        filter.price = { $gte: +req.query.priceStart };
      }

      await client.connect();
      const result: IRoom[] = (await client
        .db("test")
        .collection("restRoom")
        .find(filter)
        .toArray()) as IRoom[];
      await client.close();
      return res.status(200).send({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).send({ success: false, message: err.message });
    }
  }
}

export default RoomController;
