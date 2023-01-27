import { client } from "./database";
import { IRoom } from "./model";

seeding();

async function seeding() {
  let rooms: IRoom[] = [];
  rooms.push({
    name: "Secret Blossom Resort",
    location: {
      latitude: 65.01959,
      longitude: -21.12688,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: true,
  });
  rooms.push({
    name: "Elder Willow Resort",
    location: {
      latitude: 66.85088,
      longitude: 157.68622,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: true,
  });
  rooms.push({
    name: "Pleasant Woodland Hotel",
    location: {
      latitude: -72.00485,
      longitude: 109.55881,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: false,
  });
  rooms.push({
    name: "Double Spring Hotel",
    location: {
      latitude: 65.90872,
      longitude: 99.47036,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: true,
  });
  rooms.push({
    name: "Stellar Hotel",
    location: {
      latitude: 65.1368,
      longitude: 158.32879,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: true,
  });
  rooms.push({
    name: "Stellar Hotel",
    location: {
      latitude: 37.99425,
      longitude: 127.17631,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: true,
  });
  rooms.push({
    name: "Northern Comfort Hotel",
    location: {
      latitude: 47.14207,
      longitude: 105.76228,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: false,
  });
  rooms.push({
    name: "Luxury Resort",
    location: {
      latitude: -36.81228,
      longitude: -60.4511,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: true,
  });
  rooms.push({
    name: "Mountain Hotel & Spa",
    location: {
      latitude: -1.29186,
      longitude: 119.93245,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: true,
  });
  rooms.push({
    name: "Elysium Hotel",
    location: {
      latitude: 0.23033,
      longitude: 20.23901,
    },
    price: randomPrice(),
    left: randomLeft(),
    isActive: true,
  });
  rooms.push({
    name: "Ruby Shroud Motel",
    location: {
      latitude: 0.23033,
      longitude: 20.23901,
    },
    price: randomPrice(),
    left: 0,
    isActive: true,
  });
  await client.connect();
  await client
    .db("test")
    .collection("restRoom")
    .insertMany(rooms as any);
  await client.close();
  console.log('success')
}

function randomPrice() {
  return Math.floor(1000 + Math.random() * 2000);
}

function randomLeft() {
  return Math.floor(10 + Math.random() * 50);
}
