import userRoute from "./User.js";
import vehicleRoute from "./VehicleDetails.js";
import systemLogs from "./SystemLogs.js";
import authUser from "./Auth.js";

export default (app) => {
  app.use("/user", userRoute);
  app.use("/vehicle-details", vehicleRoute);
  app.use("/system-logs", systemLogs);
  app.use("/auth", authUser);
};
