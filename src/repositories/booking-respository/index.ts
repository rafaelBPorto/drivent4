import { prisma } from "@/config";

async function findBookingByUserId(userId:number) {
    return prisma.booking.findFirst({
        where:{
            userId
        }
    });
};

async function createBooking(userId:number, roomId: number) {
    const booking = await prisma.booking.create({
        data: {
            userId,
            roomId
        }
    });

    return {bookingId: booking.id}
    
}
export const bookingRepository = {
    findBookingByUserId,
    createBooking
}