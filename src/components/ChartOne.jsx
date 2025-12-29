import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchUsers } from "../services/userServices";
import { fetchProducts } from "../services/productServices";

const ChartOne = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Users",
        data: Array(12).fill(0),
      },
      {
        name: "Products",
        data: Array(12).fill(0),
      },
    ],
    categories: [],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        // Fetch users and products
        const [usersData, productsData] = await Promise.all([
          fetchUsers(),
          fetchProducts(),
        ]);

        // Get current date
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Create array of months (last 12 months)
        const months = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = 11; i >= 0; i--) {
          const date = new Date(currentYear, currentMonth - i, 1);
          months.push({
            name: monthNames[date.getMonth()],
            year: date.getFullYear(),
            month: date.getMonth(),
          });
        }

        // Count users per month
        const userCounts = months.map(m => {
          return usersData?.filter(user => {
            if (!user.created_at) return false;
            const userDate = new Date(user.created_at);
            return userDate.getFullYear() === m.year && userDate.getMonth() === m.month;
          }).length || 0;
        });

        // Count products per month
        const productCounts = months.map(m => {
          return productsData?.filter(product => {
            if (!product.created_at) return false;
            const productDate = new Date(product.created_at);
            return productDate.getFullYear() === m.year && productDate.getMonth() === m.month;
          }).length || 0;
        });

        // Calculate cumulative counts for growth chart
        let cumulativeUsers = 0;
        let cumulativeProducts = 0;

        const cumulativeUserCounts = userCounts.map(count => {
          cumulativeUsers += count;
          return cumulativeUsers;
        });

        const cumulativeProductCounts = productCounts.map(count => {
          cumulativeProducts += count;
          return cumulativeProducts;
        });

        // Update chart data
        setChartData({
          series: [
            {
              name: "Users",
              data: cumulativeUserCounts,
            },
            {
              name: "Products",
              data: cumulativeProductCounts,
            },
          ],
          categories: months.map(m => m.name),
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const options = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#800B47", "#3C50E0"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "smooth",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#800B47", "#3C50E0"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm bg-white px-5 pt-7 pb-5 shadow-xl sm:px-7">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <div className="w-full">
              <p className="font-semibold text-primary text-xl">Growth Overview</p>
              <p className="text-sm text-gray-500 mt-1">Users and Products registered over time</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div id="chartOne" className="-ml-5">
            <ReactApexChart
              options={options}
              series={chartData.series}
              type="area"
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartOne;
