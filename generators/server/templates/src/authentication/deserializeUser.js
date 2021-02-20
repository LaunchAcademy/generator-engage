import User from "../models/User.js";

export default async (id, done) => {
  const user = await User.query().findById(id);
  done(null, user || false);
};
