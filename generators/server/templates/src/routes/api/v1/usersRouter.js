import express from "express";
import objection from "objection"
import passport from "passport";
import { User } from "../../../models/index.js";

const { ValidationError } = objection

const usersRouter = new express.Router();

usersRouter.post("/", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  try {
    const persistedUser = await User.query().insertAndFetch({ email, password });
    return req.login(persistedUser, () => {
      return res.status(201).json({ user: persistedUser });
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(422).json({ errors: error });
  }
});

export default usersRouter;
