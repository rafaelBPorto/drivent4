import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares"
import { bookingSchema } from "@/schemas/booking-schemas";
import { bookingPost } from "@/controllers";
const bookingRouter = Router();

bookingRouter
    .all("/*", authenticateToken)
    .post("/", validateBody(bookingSchema), bookingPost );

export { bookingRouter}