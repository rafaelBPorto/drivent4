import { prisma } from "@/config"

async function findRoomById(id: number) {
    return prisma.room.findFirst({
        where:{
            id
        },
        include:{
            Booking: true
        }
    });
};

export const roomRespository = {
    findRoomById
}

