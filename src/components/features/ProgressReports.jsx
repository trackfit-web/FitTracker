import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { database } from "../../firebase/firebase";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../../contexts/authContext";

const ProgressReport = () => {
  const { currentUser } = useAuth();
  const [waterIntakeData, setWaterIntakeData] = useState({
    intake: [],
    goal: [],
  });

  useEffect(() => {
    if (currentUser) {
      const userWaterIntakeRef = ref(
        database,
        `waterIntake/${currentUser.uid}`
      );
      onValue(userWaterIntakeRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedData = Object.entries(data).map(
            ([date, { amount, goal }]) => ({
              date,
              amount,
              goal,
            })
          );

          const lastEightEntries = formattedData.slice(-8);
          const series = {
            intake: lastEightEntries.map((entry) => entry.amount || 0),
            goal: lastEightEntries.map((entry) => entry.goal || 0),
          };

          setWaterIntakeData(series);
        } else {
          setWaterIntakeData({ intake: [], goal: [] });
        }
      });
    }
  }, [currentUser]);

  const waterData = {
    series: [
      {
        name: "Intake",
        data:
          waterIntakeData.intake.length > 0
            ? waterIntakeData.intake
            : [0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "Goal",
        data:
          waterIntakeData.goal.length > 0
            ? waterIntakeData.goal
            : [15, 15, 15, 15, 15, 15, 15, 15],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      colors: ["#44bbff", "#ffD744"],
      title: {
        text: "Water Intake Progress",
      },
      xaxis: {
        categories:
          waterIntakeData.intake.length > 0
            ? waterIntakeData.intake.map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() - (8 - index));
                return date.toLocaleDateString();
              })
            : [
                "Date 1",
                "Date 2",
                "Date 3",
                "Date 4",
                "Date 5",
                "Date 6",
                "Date 7",
                "Date 8",
              ],
      },
      yaxis: {
        title: {
          text: "Liters",
        },
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Progress Report</h2>

      <Chart
        options={waterData.options}
        series={waterData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ProgressReport;
