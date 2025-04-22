import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "../CSS/Dashboard.module.css";

function Dashboard() {
  const [totalRevenueData, setTotalRevenueData] = useState([]);
  const [totalOrdersData, setTotalOrdersData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/E_Commerce/backend/admin/api/GetRevenueByYear.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          const formattedData = data.data.map((item) => ({
            year: item.year.toString(),
            revenue: Number(item.total_revenue),
          }));
          setTotalRevenueData(formattedData);

          const calculatedGrowth = formattedData.map((item, index, arr) => {
            if (index === 0) return { year: item.year, growth: 0 };
            const previousRevenue = arr[index - 1].revenue;
            const growth = previousRevenue
              ? ((item.revenue - previousRevenue) / previousRevenue) * 100
              : 0;
            return { year: item.year, growth: Math.round(growth) };
          });

          setGrowthData(calculatedGrowth);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API doanh thu tổng:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost/E_Commerce/backend/admin/api/GetOrdersByYear.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          const formattedData = data.data.map((item) => ({
            year: item.year.toString(),
            orders: Number(item.total_orders),
          }));
          setTotalOrdersData(formattedData);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API tổng đơn hàng:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost/E_Commerce/backend/admin/api/GetRevenueByMonth.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          const years = [...new Set(data.data.map((item) => item.year))];
          setYearOptions(years);
          setSelectedYear(years[years.length - 1]);

          const formattedData = data.data.map((item) => ({
            year: item.year,
            month: `Tháng ${item.month}`,
            revenue: Number(item.total_revenue),
          }));

          setMonthlyRevenueData(formattedData);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API doanh thu theo tháng:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMonthlyData = monthlyRevenueData.filter(
    (item) => item.year === selectedYear
  );

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className={styles.dashboard}>
      <h1> Admin Dashboard</h1>

      <div className={styles.chartGrid}>
        <div className={styles.chartItem}>
          <h2> Tổng Doanh Thu</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={totalRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                width={100}
                domain={["auto", "auto"]}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip formatter={(value) => value.toLocaleString("vi-VN")} />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartItem}>
          <h2> Tổng Đơn Hàng</h2>
          <ResponsiveContainer width="100%" height={250}>
            {" "}
            <BarChart layout="vertical" data={totalOrdersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="year" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#00C49F" />{" "}
            </BarChart>{" "}
          </ResponsiveContainer>
        </div>

        <div className={styles.chartItem}>
          <h2> Tăng Trưởng (%)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis type="number" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="#FF8042"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartTitle}>
          <div className={styles.filterContainer}>
            <label htmlFor="yearSelect">Chọn năm:</label>
            <select
              id="yearSelect"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <h2> Doanh Thu Theo Tháng ({selectedYear})</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredMonthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              width={100}
              domain={[
                (dataMin) => Math.floor(dataMin * 0.9),
                (dataMax) => Math.ceil(dataMax * 1.1),
              ]}
              tickFormatter={(value, index) => {
                const base = 10 ** Math.floor(Math.log10(value));
                const roundedValue = Math.round(value / base) * base;
                return roundedValue.toLocaleString("vi-VN");
              }}
            />
            <Tooltip formatter={(value) => value.toLocaleString("vi-VN")} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
