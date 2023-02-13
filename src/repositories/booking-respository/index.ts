import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: {
            userId

        }
    });
};

async function createBooking(userId: number, roomId: number) {
    const booking = await prisma.booking.create({
        data: {
            userId,
            roomId
        }
    });

    return { bookingId: booking.id }

}

async function findAllBookingsByUserId(userId: number) {
    return await prisma.booking.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            Room: true
        }


    });

};

async function updateBookingByRoomId(bookingId: number, newRoomId: number) {
    return await prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            roomId: newRoomId
        }
    })
}

async function  findBookingById(bookingId:number) {
    return prisma.booking.findFirst({
        where:{
            id: bookingId
        }
    })
    
}

export const bookingRepository = {
    findBookingByUserId,
    findAllBookingsByUserId,
    createBooking,
    updateBookingByRoomId,
    findBookingById
}