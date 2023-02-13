import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares"
import { bookingSchema } from "@/schemas/booking-schemas";
import { bookingPost, getBooking } from "@/controllers";
const bookingRouter = Router();

bookingRouter
    .all("/*", authenticateToken)
    .get("/", getBooking)
    .post("/", validateBody(bookingSchema), bookingPost );

export { bookingRouter}