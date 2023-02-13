import { InputBooking } from "@/protocols"
import Joi from "joi"

export const bookingSchema = Joi.object<InputBooking>({
     roomId: Joi.number().min(1).required()
});