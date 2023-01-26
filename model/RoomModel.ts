interface RoomModel {
  _id?: object | string;
  name: string;
  location: ILocation;
  price: number;
  left: number;
  isActive: Boolean;
}

interface ILocation {
  latitude: number;
  longitude: number;
}

export { RoomModel };
