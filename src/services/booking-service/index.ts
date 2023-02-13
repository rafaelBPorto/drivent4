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
        throw conflictError("user already has room reservation");

    //Se tiver passados em todas as regras, criar uma reserva para usuário
    const booking = await bookingRepository.createBooking(userId, roomId)

    return booking;
}

async function bookingPut(roomId: number, bookingId: number) {
   

    const booking = await bookingRepository.findBookingById(bookingId)
    if (!booking)
        throw forbiddenError();
        console.log("booking")
    const room = await roomRespository.findRoomById(roomId)
    if (!room)
        throw notFoundError();

    if (room.Booking.length >= room.capacity)
        throw forbiddenError();

    const newRoom = await bookingRepository.updateBookingByRoomId(bookingId, roomId)
    
    return newRoom; 
}

async function findBooking(userId: number) {
    const booking = await bookingRepository.findAllBookingsByUserId(userId)
    if (booking.length === 0)
        throw notFoundError();
    return booking
}
export const bookingService = {
    bookingPost,
    findBooking,
    bookingPut
}