import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchOrders } from "../services/orderServices";
import { FiCalendar, FiDollarSign, FiTrendingUp, FiDownload } from "react-icons/fi";

const SalesReportCard = () => {
    const [loading, setLoading] = useState(true);
    const [timePeriod, setTimePeriod] = useState("week"); // day, week, month, year
    const [salesData, setSalesData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        chartData: [],
        categories: []
    });

    useEffect(() => {
        fetchSalesData();
    }, [timePeriod]);

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            // Call without pagination to get all orders as array
            const orders = await fetchOrders();

            console.log("Fetched orders for sales report:", orders);

            // Handle if response is null/undefined
            if (!orders || !Array.isArray(orders)) {
                console.error("Orders data is not an array:", orders);
                setSalesData({
                    totalRevenue: 0,
                    totalOrders: 0,
                    averageOrderValue: 0,
                    chartData: [],
                    categories: []
                });
                return;
            }

            const now = new Date();
            let filteredOrders = [];
            let categories = [];
            let groupedData = {};

            switch (timePeriod) {
                case "day":
                    // Last 24 hours by hour
                    categories = Array.from({ length: 24 }, (_, i) => `${i}:00`);
                    filteredOrders = orders.filter(order => {
                        const orderDate = new Date(order.created_at);
                        const diffMs = now - orderDate;
                        return diffMs <= 24 * 60 * 60 * 1000;
                    });
                    groupedData = categories.reduce((acc, hour, index) => {
                        acc[hour] = filteredOrders.filter(order => {
                            const orderHour = new Date(order.created_at).getHours();
                            return orderHour === index;
                        }).reduce((sum, o) => sum + (parseFloat(o.payments?.amount) || 0), 0);
                        return acc;
                    }, {});
                    break;

                case "week":
                    // Last 7 days
                    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    categories = Array.from({ length: 7 }, (_, i) => {
                        const date = new Date(now);
                        date.setDate(date.getDate() - (6 - i));
                        return weekDays[date.getDay()];
                    });
                    filteredOrders = orders.filter(order => {
                        const orderDate = new Date(order.created_at);
                        const diffMs = now - orderDate;
                        return diffMs <= 7 * 24 * 60 * 60 * 1000;
                    });
                    groupedData = categories.reduce((acc, day, index) => {
                        const targetDate = new Date(now);
                        targetDate.setDate(targetDate.getDate() - (6 - index));
                        acc[day] = filteredOrders.filter(order => {
                            const orderDate = new Date(order.created_at);
                            return orderDate.toDateString() === targetDate.toDateString();
                        }).reduce((sum, o) => sum + (parseFloat(o.payments?.amount) || 0), 0);
                        return acc;
                    }, {});
                    break;

                case "month":
                    // Last 30 days by week
                    categories = ["Week 1", "Week 2", "Week 3", "Week 4"];
                    filteredOrders = orders.filter(order => {
                        const orderDate = new Date(order.created_at);
                        const diffMs = now - orderDate;
                        return diffMs <= 30 * 24 * 60 * 60 * 1000;
                    });
                    groupedData = categories.reduce((acc, week, index) => {
                        acc[week] = filteredOrders.filter(order => {
                            const orderDate = new Date(order.created_at);
                            const diffMs = now - orderDate;
                            const daysDiff = Math.floor(diffMs / (24 * 60 * 60 * 1000));
                            const weekNumber = Math.floor(daysDiff / 7);
                            return weekNumber === (3 - index);
                        }).reduce((sum, o) => sum + (parseFloat(o.payments?.amount) || 0), 0);
                        return acc;
                    }, {});
                    break;

                case "year":
                    // Last 12 months
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    categories = Array.from({ length: 12 }, (_, i) => {
                        const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
                        return monthNames[date.getMonth()];
                    });
                    filteredOrders = orders.filter(order => {
                        const orderDate = new Date(order.created_at);
                        const diffMs = now - orderDate;
                        return diffMs <= 365 * 24 * 60 * 60 * 1000;
                    });
                    groupedData = categories.reduce((acc, month, index) => {
                        const targetDate = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
                        acc[month] = filteredOrders.filter(order => {
                            const orderDate = new Date(order.created_at);
                            return orderDate.getMonth() === targetDate.getMonth() &&
                                orderDate.getFullYear() === targetDate.getFullYear();
                        }).reduce((sum, o) => sum + (parseFloat(o.payments?.amount) || 0), 0);
                        return acc;
                    }, {});
                    break;

                default:
                    break;
            }

            const chartData = categories.map(cat => groupedData[cat] || 0);
            const totalRevenue = filteredOrders.reduce((sum, o) => sum + (parseFloat(o.payments?.amount) || 0), 0);
            const totalOrders = filteredOrders.length;
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            console.log("Sales data calculated:", { totalRevenue, totalOrders, averageOrderValue, chartData, categories });

            setSalesData({
                totalRevenue,
                totalOrders,
                averageOrderValue,
                chartData,
                categories
            });

        } catch (error) {
            console.error("Error fetching sales data:", error);
        } finally {
            setLoading(false);
        }
    };

    const chartOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            fontFamily: "Satoshi, sans-serif",
        },
        colors: ["#800B47"],
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: "60%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: salesData.categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (val) => `MVR ${val.toFixed(0)}`,
            },
        },
        grid: {
            strokeDashArray: 5,
        },
        tooltip: {
            y: {
                formatter: (val) => `MVR ${val.toFixed(2)}`,
            },
        },
    };

    const chartSeries = [
        {
            name: "Revenue",
            data: salesData.chartData,
        },
    ];

    const downloadCSV = () => {
        const headers = ["Period", "Revenue (MVR)"];
        const rows = salesData.categories.map((cat, i) => [
            `"${cat}"`,
            salesData.chartData[i]?.toFixed(2) ?? "0.00",
        ]);
        rows.push(["", ""]);
        rows.push([`"Total Revenue"`, salesData.totalRevenue.toFixed(2)]);
        rows.push([`"Total Orders"`, salesData.totalOrders]);
        rows.push([`"Avg Order Value"`, salesData.averageOrderValue.toFixed(2)]);
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sales_report_${timePeriod}_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="col-span-12 rounded-xl bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <FiDollarSign className="text-primary" />
                        Sales Report
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Revenue and order analytics</p>
                </div>

                {/* Time Period Selector + Download */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                        {[
                            { value: "day", label: "Day" },
                            { value: "week", label: "Week" },
                            { value: "month", label: "Month" },
                            { value: "year", label: "Year" }
                        ].map((period) => (
                            <button
                                key={period.value}
                                onClick={() => setTimePeriod(period.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timePeriod === period.value
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={downloadCSV}
                        disabled={loading || salesData.categories.length === 0}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Download Sales Report as CSV"
                    >
                        <FiDownload size={14} />
                        Download CSV
                    </button>
                </div>

            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500 rounded-lg">
                                    <FiDollarSign className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        MVR {salesData.totalRevenue.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500 rounded-lg">
                                    <FiCalendar className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {salesData.totalOrders}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-500 rounded-lg">
                                    <FiTrendingUp className="text-white text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        MVR {salesData.averageOrderValue.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="mt-4">
                        <ReactApexChart
                            options={chartOptions}
                            series={chartSeries}
                            type="bar"
                            height={300}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default SalesReportCard;
