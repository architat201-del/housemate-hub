import { Router } from "express";
import { db } from "@workspace/db";
import { roomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListRoomsParams, CreateRoomParams, CreateRoomBody, UpdateRoomParams, UpdateRoomBody, DeleteRoomParams } from "@workspace/api-zod";

const router = Router();

const formatRoom = (r: typeof roomsTable.$inferSelect) => ({
  ...r,
  createdAt: r.createdAt.toISOString(),
});

router.get("/households/:householdId/rooms", async (req, res) => {
  try {
    const { householdId } = ListRoomsParams.parse({ householdId: Number(req.params.householdId) });
    const rooms = await db.select().from(roomsTable).where(eq(roomsTable.householdId, householdId));
    res.json(rooms.map(formatRoom));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list rooms" });
  }
});

router.post("/households/:householdId/rooms", async (req, res) => {
  try {
    const { householdId } = CreateRoomParams.parse({ householdId: Number(req.params.householdId) });
    const body = CreateRoomBody.parse(req.body);
    const [room] = await db.insert(roomsTable).values({
      householdId,
      name: body.name,
      monthlyRent: body.monthlyRent,
      description: body.description,
    }).returning();
    res.status(201).json(formatRoom(room));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to create room" });
  }
});

router.patch("/rooms/:roomId", async (req, res) => {
  try {
    const { roomId } = UpdateRoomParams.parse({ roomId: Number(req.params.roomId) });
    const body = UpdateRoomBody.parse(req.body);
    const [room] = await db.update(roomsTable).set({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.monthlyRent !== undefined && { monthlyRent: body.monthlyRent }),
      ...(body.description !== undefined && { description: body.description }),
    }).where(eq(roomsTable.id, roomId)).returning();
    if (!room) return res.status(404).json({ error: "Not found" });
    res.json(formatRoom(room));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update room" });
  }
});

router.delete("/rooms/:roomId", async (req, res) => {
  try {
    const { roomId } = DeleteRoomParams.parse({ roomId: Number(req.params.roomId) });
    await db.delete(roomsTable).where(eq(roomsTable.id, roomId));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

export default router;
