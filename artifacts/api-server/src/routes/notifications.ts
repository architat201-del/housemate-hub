import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";
import { z } from "zod/v4";

const router = Router();

router.get("/notifications", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(50);

    res.json(
      notifications.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.get("/notifications/unread-count", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const rows = await db
      .select({ id: notificationsTable.id })
      .from(notificationsTable)
      .where(
        and(
          eq(notificationsTable.userId, userId),
          eq(notificationsTable.isRead, false)
        )
      );
    res.json({ count: rows.length });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to count notifications" });
  }
});

router.post("/notifications/:id/read", requireAuth, async (req, res) => {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const userId = req.session.userId!;
    await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(and(eq(notificationsTable.id, id), eq(notificationsTable.userId, userId)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

router.post("/notifications/read-all", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(
        and(
          eq(notificationsTable.userId, userId),
          eq(notificationsTable.isRead, false)
        )
      );
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
});

router.delete("/notifications/:id", requireAuth, async (req, res) => {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const userId = req.session.userId!;
    await db
      .delete(notificationsTable)
      .where(and(eq(notificationsTable.id, id), eq(notificationsTable.userId, userId)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;
