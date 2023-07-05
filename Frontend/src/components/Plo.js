import React, { useEffect, useState, useRef } from "react";
import { calculateClo, getCourseById } from "../apiCalls";
import { useParams } from "react-router-dom";
import { Card,Button } from "@mui/material";
import { toast } from "react-toastify";
import Menue from "./Menue";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
export default function Plo() {
  const { id } = useParams();
  const [ploData, setploData] = useState([]);
  const [ploIds, setploIds] = useState([]);
  const tableRef = useRef(null);
  const [course, setCourse] = React.useState([]);

  const tableContainerRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calculate CLO achievement using the apiCalls function
        const calculatedploData = await calculateClo({ id: id });

        // Merge cloAchievements with the same ploId
        const mergedploData = mergeCloAchievementsByPloId(
          calculatedploData.data
        );

        // Set the calculated and merged CLO data in the state
        setploData(mergedploData);

        // Extract the CLO IDs from the data and set them in the state
        if (mergedploData.length > 0) {
          const extractedploIds = Object.keys(mergedploData[0].cloAchievements);
          setploIds(extractedploIds);
        }

        console.log(mergedploData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch CLO data.");
      }
    };

    fetchData();
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const res = await getCourseById({ id: id });
      if (res && res.data.length > 0) {
        setCourse(res.data[0]);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const mergeCloAchievementsByPloId = (data) => {
    const mergedData = [];

    data.forEach((student) => {
      const mergedCloAchievements = {};

      Object.values(student.cloAchievements).forEach((achievement) => {
        const { cloId, ploId, totalMarks, obtainedMarks, ploKpi, cloKpi } =
          achievement;

        if (!mergedCloAchievements[ploId]) {
          mergedCloAchievements[ploId] = {
            cloId,
            ploId,
            totalMarks,
            ploKpi,
            cloKpi,
            obtainedMarks,
          };
        } else {
          mergedCloAchievements[ploId].totalMarks += totalMarks;
          mergedCloAchievements[ploId].obtainedMarks += obtainedMarks;
        }
      });

      student.cloAchievements = Object.values(mergedCloAchievements);
      mergedData.push(student);
    });

    return mergedData;
  };

  const handleExportPDF = () => {
    const tableContainer = tableContainerRef.current;
    tableContainer.scrollLeft = 0;
    tableContainer.scrollTop = 0;

    const dpi = 300; // Increase DPI for higher resolution
    const scale = dpi / 96; // Adjust scale factor based on DPI

    html2canvas(tableRef.current, { scrollX: -window.scrollX, scale: scale })
      .then((canvas) => {
        const pdf = new jsPDF("l", "pt", "a4");
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, null, "FAST"); // Use "FAST" option for better rendering
        pdf.save(course.name + " - " + course.courseType + "-PLO.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };
  return (
    <div className="m-5">
      <Card
        style={{
          padding: "30px 20px 20px 20px",
          marginTop: "30px",
          marginBottom: "30px",
          marginLeft: "5px",
          marginRight: "5px",
        }}
      >
        <div
          className="d-flex justify-content-center"
          style={{ color: "#346448" }}
        >
          <Menue />
        </div>
        <div className="row">
          <div className="col-md-12 d-flex justify-content-between">
            <p className="scoreboardheading">PLO Attainment</p>
            <div>
              <Button
                 sx={{backgroundColor:'#346448',marginBottom:'2em',color:'white'}}
                onClick={handleExportPDF}
              >
                Export to PDF
              </Button>
            </div>
          </div>
        </div>
        <div
          ref={tableContainerRef}
          className="table-responsive py-0 px-0"
          style={{ height: "600px", overflow: "auto", textAlign: "center" }}
        >
          <table
            ref={tableRef}
            className="table table-bordered score4 text-center"
          >
            <thead>
              <tr className="score">
                <th rowSpan="3" colSpan="3">
                  Participants
                </th>
                {ploIds?.map((cloId) => (
                  <th style={{ top: "0px" }} key={cloId}>
                    Plo {ploData?.[0]?.cloAchievements[cloId]?.ploId}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="score2">
                <th style={{ top: "0px", width: "50px" }} className="mt-0">
                  Sr no.
                </th>
                <th style={{ top: "0px", width: "150px" }} className="mt-0">
                  Roll no.
                </th>
                <th style={{ top: "0px", width: "320px" }} className="mt-0">
                  Name
                </th>

                {ploIds?.map((cloId) => (
                  <th style={{ top: "0px" }} key={cloId}>
                    {Number(
                      ploData?.[0]?.cloAchievements[cloId]?.totalMarks
                    ).toFixed(1)}
                  </th>
                ))}
              </tr>
              {ploData?.map((student, index) => (
                <tr className="score2" key={student.roll_no}>
                  <td>{index + 1}</td>
                  <td>{student.roll_no}</td>
                  <td>{student.name}</td>

                  {ploIds.map((cloId) => (
                    <td
                      key={cloId}
                      className={
                        "text-success " +
                        (parseFloat(
                          student.cloAchievements[cloId]?.obtainedMarks /
                            student.cloAchievements[cloId]?.totalMarks
                        ) *
                          100 <
                        parseFloat(student.cloAchievements[cloId]?.ploKpi)
                          ? "bg-danger text-white"
                          : "")
                      }
                    >
                      {student.cloAchievements[cloId] ? (
                        <>
                          {parseFloat(
                            student.cloAchievements[cloId]?.obtainedMarks /
                              student.cloAchievements[cloId]?.totalMarks
                          ) *
                            100 <
                          parseFloat(student.cloAchievements[cloId]?.ploKpi)
                            ? "No"
                            : "Yes"}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
