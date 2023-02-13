import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import {createPayment, createTicket, createTicketType, createTicketTypeRemote, createTicketTypeWithHotel, initRoom } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });
const server = supertest(app)

describe("POST /booking", () => {
    it("should respond with status 200 if the booking was generated", async () => {
        const {token, enrollment, room} = await initRoom()
    
        //criar pagemento
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toBe(httpStatus.OK)
    });

    it("should respond with status 403 if room no more capacity", async () => {
        const {token, enrollment, room} = await initRoom(0)

        //criar pagemento
        const ticketType = await createTicketTypeRemote()
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id});
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    });

    it("should respond with status 404 if roomId don't exist", async () => {
        const {token, room} = await initRoom()

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id+1});
        expect(response.status).toBe(httpStatus.NOT_FOUND)
    });

    it("should respond with status 403 if tikect type is remote", async () => {
        const {token, enrollment, room} = await initRoom()

        //criar pagemento
        const ticketType = await createTicketTypeRemote()
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id});
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    });

    it("should respond with status 403 if the ticket type don't include hotel", async () => {
        const {token, enrollment, room} = await initRoom()

        //criar pagemento
        const ticketType = await createTicketType(false)
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    });

    it("should respond with status 403 if ticket status is not PAID", async () => {
        const {token, enrollment, room} = await initRoom()

        //criar pagemento
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, "RESERVED")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toBe(httpStatus.FORBIDDEN)
    });

    it("should respond with status 409 if use already reserved room", async () => {
        const {token, enrollment, room} = await initRoom()
    
        //criar pagemento
        const ticketType = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
        await createPayment(ticket.id, ticketType.price)

        //testar reserva
        await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
        expect(response.status).toBe(httpStatus.CONFLICT)
    });
});