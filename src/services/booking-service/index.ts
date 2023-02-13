import { conflictError, forbiddenError, notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories/booking-respository";
import { roomRespository } from "@/repositories/room-repository";
import ticketService from "../tickets-service";

async function bookingPost(userId: number, roomId: number) {

    //Testar existêcnia e ocupação do quarto
    const room = await roomRespository.findRoomById(roomId);
    if (!room)
        throw notFoundError();

    if (room.Booking.length >= room.capacity)
        throw forbiddenError();

    //Testar se ticket é existe, é presecial, tem hotel incluso e se foi pago
    const ticket = await ticketService.getTicketByUserId(userId)

    if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== "PAID")
        throw forbiddenError();

    //Testar se já existe reserva para este usuário
    const isBooking = await bookingRepository.findBookingByUserId(userId)
    if (isBooking)
        throw  conflictError("user already has room reservation");

    //Se tiver passados em todas as regras, criar uma reserva para usuário
    const booking = bookingRepository.createBooking(userId, roomId)
    if (!booking)
        throw notFoundError();

    return booking;
}



export const bookingService = {
    bookingPost,
}