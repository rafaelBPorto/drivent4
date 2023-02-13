import { AuthenticatedRequest } from "@/middlewares";
import { InputBooking } from "@/protocols";
import { bookingService } from "@/services/booking-service";
import { Booking } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

export async function bookingPost(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body as InputBooking

    try {
        const booking = await bookingService.bookingPost(userId, roomId)
        res.status(httpStatus.OK).send(booking)
    } catch (error) {
        switch (error.name) {
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

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const booking = await bookingService.findBooking(userId)
        res.status(httpStatus.OK).send(booking)
    } catch (error) {
        switch (error.name) {
            case "NotFoundError":
                return res.sendStatus(httpStatus.NOT_FOUND);
            default:
                return res.sendStatus(500);
        }
    }

}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
    const { roomId } = req.body
    const bookingId = Number(req.params.bookingId)

    try {
        const booking = await bookingService.bookingPut(roomId, bookingId)
        return res.send({ bookingId: booking.id });
    } catch (error) {
        switch (error.name) {
            case "NotFoundError":
                return res.sendStatus(httpStatus.NOT_FOUND);
            case "ForbiddenError":
                return res.sendStatus(httpStatus.FORBIDDEN);
            default:
                return res.sendStatus(500);
        }
    }

}