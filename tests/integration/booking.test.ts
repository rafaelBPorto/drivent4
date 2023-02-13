import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketType, createTicketTypeRemote, createTicketTypeWithHotel, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });
const server = supertest(app)

describe("POST /booking", () => {
    it("should respond with status 200 if the booking was generated", async () => {
        //criar inscrição
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);

        //criar quarto
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)


        //criar pagemento
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toBe(httpStatus.OK)
    });

    it("should respond with status 404 if roomId don't exist", async () => {
        //criar inscrição
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);

        // criar quarto
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)


        //criar pagemento
        // const ticketType = await createTicketTypeWithHotel()
        // const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
        // await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id+1});
        expect(response.status).toBe(httpStatus.NOT_FOUND)
    });

    it("should respond with status 403 if tikect type is remote", async () => {
        //criar inscrição
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);

        // criar quarto
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id, 0)


        //criar pagemento
        const ticketType = await createTicketTypeRemote()
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id});
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    });

    it("should respond with status 403 if the ticket type don't include hotel", async () => {
        //criar inscrição
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);

        //criar quarto
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)


        //criar pagemento
        const ticketType = await createTicketType(false)
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    });

    it("should respond with status 403 if ticket status is not PAID", async () => {
        //criar inscrição
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);

        //criar quarto
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)


        //criar pagemento
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, "RESERVED")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    });


});