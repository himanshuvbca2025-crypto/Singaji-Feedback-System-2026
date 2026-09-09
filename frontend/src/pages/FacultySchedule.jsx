import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.js";
import "./FacultySchedule.css";

function FacultySchedule() {
  const { user } = useAuth();

  const [schedules, setSchedules] = useState([]);
  const [scheduleTiming, setScheduleTiming] = useState({
    slot1: { startTime: "", endTime: "" },
    lunchBreak: { startTime: "", endTime: "" },
    slot2: { startTime: "", endTime: "" },
    teaBreak: { startTime: "", endTime: "" },
    slot3: { startTime: "", endTime: "" },
  });

  const authUser = JSON.parse(localStorage.getItem("authUser"));

  // Get only today's schedules for the logged-in faculty's department
  useEffect(() => {
    const fetchTodaySchedules = async () => {
      try {
        if (!user?.department) return;

        const response = await fetch(
          `http://localhost:5000/api/schedules/today?department=${encodeURIComponent(
            user.department
          )}`,
           {
           headers: {
            Authorization: `Bearer ${authUser?.token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Failed to fetch today's schedules:",
            data.message
          );
          return;
        }

        const dbSchedules = data.schedules || [];
        setSchedules(dbSchedules);

        // All rows of the day use the timing from the first schedule.
        if (dbSchedules.length > 0) {
          const firstSchedule = dbSchedules[0];

          setScheduleTiming({
            slot1: {
              startTime: firstSchedule.slot1?.startTime || "",
              endTime: firstSchedule.slot1?.endTime || "",
            },
            lunchBreak: {
              startTime: firstSchedule.lunchBreak?.startTime || "",
              endTime: firstSchedule.lunchBreak?.endTime || "",
            },
            slot2: {
              startTime: firstSchedule.slot2?.startTime || "",
              endTime: firstSchedule.slot2?.endTime || "",
            },
            teaBreak: {
              startTime: firstSchedule.teaBreak?.startTime || "",
              endTime: firstSchedule.teaBreak?.endTime || "",
            },
            slot3: {
              startTime: firstSchedule.slot3?.startTime || "",
              endTime: firstSchedule.slot3?.endTime || "",
            },
          });
        } else {
          setScheduleTiming({
            slot1: { startTime: "", endTime: "" },
            lunchBreak: { startTime: "", endTime: "" },
            slot2: { startTime: "", endTime: "" },
            teaBreak: { startTime: "", endTime: "" },
            slot3: { startTime: "", endTime: "" },
          });
        }
      } catch (error) {
        console.error("Error fetching today's schedules:", error);
      }
    };

    fetchTodaySchedules();
  }, [user?.department]);

  const today = new Date();

  const currentDate = today
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");

  const currentDay = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const formatTime = (time) => {
    if (!time) return "--:--";

    const [hours, minutes] = time.split(":");
    const hour = Number(hours);
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${String(displayHour).padStart(2, "0")}:${minutes} ${suffix}`;
  };

  const handleShareSchedule = async () => {
    let shareText =
      "SANT SINGAJI INSTITUTE OF SCIENCE AND MANAGEMENT, SANDALPUR\n";
    shareText += `Date: ${currentDate} | Day: ${currentDay}\n`;
    shareText += "====================================\n\n";

    schedules.forEach((row) => {
      shareText += `Class: ${row.class} | Group: ${
        row.groups?.join(", ") || ""
      } | Strength: ${row.strength}\n`;

      shareText += `[${formatTime(
        scheduleTiming.slot1.startTime
      )} - ${formatTime(
        scheduleTiming.slot1.endTime
      )}]: ${row.slot1?.subject || "Empty"} (${
        row.slot1?.facultyName || "None"
      })\n`;

      shareText += `[${formatTime(
        scheduleTiming.lunchBreak.startTime
      )} - ${formatTime(
        scheduleTiming.lunchBreak.endTime
      )}]: LUNCH BREAK\n`;

      shareText += `[${formatTime(
        scheduleTiming.slot2.startTime
      )} - ${formatTime(
        scheduleTiming.slot2.endTime
      )}]: ${row.slot2?.subject || "Empty"} (${
        row.slot2?.facultyName || "None"
      })\n`;

      shareText += `[${formatTime(
        scheduleTiming.teaBreak.startTime
      )} - ${formatTime(
        scheduleTiming.teaBreak.endTime
      )}]: TEA BREAK\n`;

      shareText += `[${formatTime(
        scheduleTiming.slot3.startTime
      )} - ${formatTime(
        scheduleTiming.slot3.endTime
      )}]: ${row.slot3?.subject || "Empty"} (${
        row.slot3?.facultyName || "None"
      })\n`;

      shareText += "------------------------------------\n";
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Today's Complete Academic Schedule",
          text: shareText,
        });
      } catch (error) {
        console.error("Error sharing schedule", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Complete schedule copied to clipboard!");
      } catch (error) {
        alert("Failed to copy schedule to clipboard.");
      }
    }
  };

  return (
    <div className="faculty-page">
      <div className="faculty-page-header">
        <h1>My Schedule</h1>
        <p>View and share the complete academic timetable for today.</p>
      </div>

      <div className="timetable-wrapper">
        <div className="timetable-header-top">
          <div className="institute-info">
            <h2>
              Sant Singaji Institute of Science and Management, Sandalpur
            </h2>
            <p>
              Today • Date: {currentDate} • {currentDay}
            </p>
          </div>

          <button
            className="btn-share-schedule"
            onClick={handleShareSchedule}
          >
            <span>📤</span> Share Schedule
          </button>
        </div>

        <div className="table-responsive">
          <table className="academic-timetable">
            <thead>
              <tr>
                <th rowSpan="2">S.No.</th>
                <th rowSpan="2">Classes</th>
                <th rowSpan="2">Groups Name</th>
                <th rowSpan="2">Strength</th>
                <th>Slot 1</th>
                <th rowSpan="2">Lunch Break</th>
                <th>Slot 2</th>
                <th rowSpan="2">Tea Break</th>
                <th>Slot 3</th>
              </tr>

              <tr className="timing-header">
                <th>
                  {formatTime(scheduleTiming.slot1.startTime)} to{" "}
                  {formatTime(scheduleTiming.slot1.endTime)}
                </th>

                <th>
                  {formatTime(scheduleTiming.slot2.startTime)} to{" "}
                  {formatTime(scheduleTiming.slot2.endTime)}
                </th>

                <th>
                  {formatTime(scheduleTiming.slot3.startTime)} to{" "}
                  {formatTime(scheduleTiming.slot3.endTime)}
                </th>
              </tr>
            </thead>

            <tbody>
              {schedules.map((row, index) => (
                <tr key={row._id}>
                  <td>{index + 1}</td>

                  <td>{row.class}</td>

                  <td>{row.groups?.join(", ") || "-"}</td>

                  <td>{row.strength}</td>

                  <td>
                    {row.slot1?.subject ? (
                      <>
                        <div className="slot-subject">
                          {row.slot1.subject}
                        </div>
                        <div className="slot-faculty">
                          {row.slot1.facultyName}
                        </div>
                      </>
                    ) : (
                      <div className="empty-slot">-</div>
                    )}
                  </td>

                  {index === 0 && (
                    <td
                      className="break-cell"
                      rowSpan={schedules.length}
                    >
                      LUNCH BREAK
                    </td>
                  )}

                  <td>
                    {row.slot2?.subject ? (
                      <>
                        <div className="slot-subject">
                          {row.slot2.subject}
                        </div>
                        <div className="slot-faculty">
                          {row.slot2.facultyName}
                        </div>
                      </>
                    ) : (
                      <div className="empty-slot">-</div>
                    )}
                  </td>

                  {index === 0 && (
                    <td
                      className="break-cell"
                      rowSpan={schedules.length}
                    >
                      TEA BREAK
                    </td>
                  )}

                  <td>
                    {row.slot3?.subject ? (
                      <>
                        <div className="slot-subject">
                          {row.slot3.subject}
                        </div>
                        <div className="slot-faculty">
                          {row.slot3.facultyName}
                        </div>
                      </>
                    ) : (
                      <div className="empty-slot">-</div>
                    )}
                  </td>
                </tr>
              ))}

              {schedules.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty-schedule">
                    No schedule available for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FacultySchedule;
