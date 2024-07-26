const express = require("express");

const {
  postSchedule,
  getSchedules,
  getScheduleById,
  getScheduleByUserId,
  patchSchedule,
  deleteSchedule
} = require("../controllers/scheduleController");

const router = express.Router();

router.post("", postSchedule);
router.get("", getSchedules);
router.get("/ById", getScheduleById);
router.get("/ByUserId", getScheduleByUserId);
router.patch("", patchSchedule);
router.delete("", deleteSchedule);

module.exports = router;
