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
router.get("", getScheduleById);
router.get("", getScheduleByUserId);
router.patch("", patchSchedule);
router.delete("", deleteSchedule);

module.exports = router;
