import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketTypeWithHotel, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });
const server = supertest(app)

describe("POST /booking", () => {
    it("should respond with ", async () => {
        //criar inscrição
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);

        //criar quarto
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)


        //criar pagemento
        const ticketType = await createTicketTypeWithHotel()
        const ticked = await createTicket(enrollment.id, ticketType.id, "PAID")
        await createPayment(ticked.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toBe(httpStatus.OK)
    });
});