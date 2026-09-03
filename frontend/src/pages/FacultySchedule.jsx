import { useState } from "react";
import { timetableData } from "../data/facultyData.js";
import "./FacultySchedule.css";

function FacultySchedule() {
  const [currentDate] = useState("03-09-2026");
  const [currentDay] = useState("Thursday");

  const handleShareSchedule = async () => {
    // Generate the complete schedule text
    let shareText = `SANT SINGAJI INSTITUTE OF SCIENCE AND MANAGEMENT, SANDALPUR\n`;
    shareText += `Date: ${currentDate} | Day: ${currentDay}\n`;
    shareText += `====================================\n\n`;

    timetableData.forEach((row) => {
      shareText += `Class: ${row.class} | Group: ${row.group} | Strength: ${row.strength}\n`;
      shareText += `[10:00 AM - 11:30 AM]: ${row.slot1.subject || "Empty"} (${row.slot1.faculty || "None"})\n`;
      shareText += `[11:30 AM - 12:10 PM]: LUNCH BREAK\n`;
      shareText += `[12:10 PM - 01:40 PM]: ${row.slot2.subject || "Empty"} (${row.slot2.faculty || "None"})\n`;
      shareText += `[01:40 PM - 02:00 PM]: TEA BREAK\n`;
      shareText += `[02:00 PM - 03:30 PM]: ${row.slot3.subject || "Empty"} (${row.slot3.faculty || "None"})\n`;
      shareText += `------------------------------------\n`;
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
      } catch (err) {
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
            <h2>Sant Singaji Institute of Science and Management, Sandalpur</h2>
            <p>September 2026 • Date: {currentDate} • {currentDay} • Day 23</p>
          </div>
          
          <button className="btn-share-schedule" onClick={handleShareSchedule}>
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
                <th>10:00 AM to 11:30 AM</th>
                <th>12:10 PM to 01:40 PM</th>
                <th>02:00 PM to 03:30 PM</th>
              </tr>
            </thead>
            <tbody>
              {timetableData.map((row, index) => (
                <tr key={row.sno}>
                  <td>{row.sno}</td>
                  <td>{row.class}</td>
                  <td>{row.group}</td>
                  <td>{row.strength}</td>
                  <td>
                    {row.slot1.subject ? (
                      <>
                        <div className="slot-subject">{row.slot1.subject}</div>
                        <div className="slot-faculty">{row.slot1.faculty}</div>
                      </>
                    ) : (
                      <div className="empty-slot">-</div>
                    )}
                  </td>

                  {/* Render Lunch Break ONLY ONCE and span rows */}
                  {index === 0 && (
                    <td className="break-cell" rowSpan={timetableData.length}>
                      LUNCH BREAK
                    </td>
                  )}

                  <td>
                    {row.slot2.subject ? (
                      <>
                        <div className="slot-subject">{row.slot2.subject}</div>
                        <div className="slot-faculty">{row.slot2.faculty}</div>
                      </>
                    ) : (
                      <div className="empty-slot">-</div>
                    )}
                  </td>

                  {/* Render Tea Break ONLY ONCE and span rows */}
                  {index === 0 && (
                    <td className="break-cell" rowSpan={timetableData.length}>
                      TEA BREAK
                    </td>
                  )}

                  <td>
                    {row.slot3.subject ? (
                      <>
                        <div className="slot-subject">{row.slot3.subject}</div>
                        <div className="slot-faculty">{row.slot3.faculty}</div>
                      </>
                    ) : (
                      <div className="empty-slot">-</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FacultySchedule;
