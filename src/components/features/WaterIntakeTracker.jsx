import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { database } from "../../firebase/firebase";
import { ref, onValue, set } from "firebase/database";
import { useAuth } from "../../contexts/authContext";

const WaterIntakeTracker = () => {
  const { currentUser } = useAuth();
  const [waterIntake, setWaterIntake] = useState("");
  const [goal, setGoal] = useState(15);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [waterIntakeData, setWaterIntakeData] = useState([]);
  const [view, setView] = useState("weekly");
  const [chartData, setChartData] = useState({ categories: [], series: [] });

  const generateChartData = (data) => {
    const today = new Date();
    const filteredData = data.filter((entry) => {
      const entryDate = new Date(entry.date);
      return view === "weekly"
        ? (today - entryDate) / (1000 * 60 * 60 * 24) <= 7
        : entryDate.getFullYear() === today.getFullYear();
    });

    const groupedData = {};
    filteredData.forEach((entry) => {
      const dateStr =
        view === "weekly"
          ? new Date(entry.date).toLocaleDateString("en-US", {
              weekday: "short",
            })
          : new Date(entry.date).toLocaleDateString("en-US", {
              month: "short",
            });

      groupedData[dateStr] = (groupedData[dateStr] || 0) + entry.amount;
    });

    const categories = Object.keys(groupedData);
    const series = [
      {
        name: "Water Intake (L)",
        data: categories.map((cat) => groupedData[cat] || 0),
      },
    ];

    return { categories, series };
  };

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
          setWaterIntakeData(formattedData);
          const newChartData = generateChartData(formattedData);
          setChartData(newChartData);
        } else {
          setWaterIntakeData([]);
          setChartData({ categories: [], series: [] });
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const newChartData = generateChartData(waterIntakeData);
    setChartData(newChartData);
  }, [view, waterIntakeData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (waterIntake && selectedDate && currentUser) {
      const dateKey = selectedDate.toISOString().split("T")[0];
      const userWaterIntakeRef = ref(
        database,
        `waterIntake/${currentUser.uid}/${dateKey}`
      );

      set(userWaterIntakeRef, {
        amount: Number(waterIntake),
        goal: Number(goal),
      }).then(() => {
        const updatedData = waterIntakeData.filter(
          (entry) => entry.date !== dateKey
        );
        updatedData.push({
          date: dateKey,
          amount: Number(waterIntake),
          goal: Number(goal),
        });
        setWaterIntakeData(updatedData);
        const newChartData = generateChartData(updatedData);
        setChartData(newChartData);
      });

      setWaterIntake("");
    }
  };

  return (
    <div className="container mx-auto p-5">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-7">
        <h3 className="font-medium text-black  mb-6">
          Water Intake Tracker
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              className="mb-3 block text-black "
              for="water-intake"
            >
              Water Intake (L)
            </label>
            <input
              id="water-intake"
              type="number"
              step="0.1"
              value={waterIntake}
              onChange={(e) => setWaterIntake(e.target.value)}
              placeholder="Enter water intake in liters"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input "
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-black " for="goal">
              Goal (L)
            </label>
            <input
              id="goal"
              type="number"
              step="0.1"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input "
            />
          </div>

          <div>
            <label className="mb-3 block text-black " for="date">
              Date
            </label>
            <DatePicker
              id="date"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input "
              required
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded bg-red-800 p-3 font-medium text-red hover:bg-opacity-90"
          >
            Add Water Intake
          </button>
        </form>

        <div className="mt-5">
          <label className="mb-2 block text-black ">View:</label>
          <select
            aria-label="view-graph"
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input "
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="mt-8 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-7">
        <h3 className="font-medium text-black  mb-6">
          Water Intake - Last {view === "weekly" ? "7 Days" : "Year"}
        </h3>
        <ReactApexChart
          options={{
            colors: ["#3C50E0"],
            chart: {
              fontFamily: "Satoshi, sans-serif",
              type: "bar",
              height: 335,
              stacked: true,
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 0,
                columnWidth: "25%",
              },
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories:
                chartData.categories.length > 0
                  ? chartData.categories
                  : ["No Data"],
            },
            legend: {
              position: "top",
              horizontalAlign: "left",
              fontFamily: "Satoshi, sans-serif",
            },
            yaxis: {
              title: {
                text: "Water Intake (L)",
              },
              labels: {
                formatter: function (val) {
                  return parseFloat(val).toFixed(1);
                },
              },
            },
          }}
          series={
            chartData.series.length > 0
              ? chartData.series
              : [{ name: "Water Intake (L)", data: [0] }]
          }
          type="bar"
          height={335}
        />
      </div>
    </div>
  );
};

export default WaterIntakeTracker;
