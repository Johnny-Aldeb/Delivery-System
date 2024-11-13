import { eventManager } from "./EventManager";

eventManager.on("userCreated", (user) => {
  console.log(`User created: ${user.email}`);
  //email notification later
});

eventManager.on("orderCreated", (trackingNumber) => {
  console.log(`Order created with tracking number: ${trackingNumber}`);
  //email notification later
});
