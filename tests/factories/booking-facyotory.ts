import { prisma } from "@/config";
import { generateValidToken } from "../helpers";
import { createEnrollmentWithAddress } from "./enrollments-factory";
import { createHotel, createRoomWithHotelId } from "./hotels-factory";
import { createUser } from "./users-factory";

export async function initRoom(capacity? : number ){
    //criar inscrição
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);

        //criar quarto
        const hotel = await createHotel();
        const room = capacity === 0 ? await createRoomWithHotelId(hotel.id, capacity) : await createRoomWithHotelId(hotel.id)

        return {user, token, enrollment, room}
}
