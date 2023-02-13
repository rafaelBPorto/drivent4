import { AuthenticatedRequest } from "@/middlewares";
import { InputBooking } from "@/protocols";
import { bookingService } from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function bookingPost(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as InputBooking

    try {
        const booking = await bookingService.bookingPost(userId, roomId)
        res.status(httpStatus.OK).send(booking)
    } catch (error) {
        switch (error.name){
            case "NotFoundError":
                return res.sendStatus(httpStatus.NOT_FOUND);
            case "ForbiddenError":
                return res.sendStatus(httpStatus.FORBIDDEN);
            case "ConflictError":
                return res.sendStatus(httpStatus.CONFLICT);       
            default:
                return res.sendStatus(500);
        }
    }
}