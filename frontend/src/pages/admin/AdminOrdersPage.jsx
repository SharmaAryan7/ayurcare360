import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import OrdersTable from '../../components/admin/orders/OrdersTable';
import OrderMetricsRow from '../../components/admin/orders/OrderMetricsRow';
import { Loader2 } from 'lucide-react';

const AdminOrdersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    orders: [],
    metrics: { todaysRevenue: 0, pendingTasks: 0, growthRate: "0%" }
  });

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const [ordRes, revRes, taskRes, growthRes] = await Promise.all([
          adminApi.getOrdersByPagination(1), // Pass page 1 initially
          adminApi.getTodaysRevenue(),
          adminApi.getPendingOrderTasks(),
          adminApi.getOrderGrowthRate()
        ]);

        setData({
          orders: ordRes.orders || [],
          metrics: {
            todaysRevenue: revRes.revenue || 0,
            pendingTasks: taskRes.count || 0,
            growthRate: growthRes.rate || "0%"
          }
        });
      } catch (error) {
        console.error("Failed to load orders data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrdersData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl md:text-[32px] font-extrabold text-green-700 tracking-tight leading-none mb-2">
          Orders
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Manage pharmacy dispensations, equipment orders, and payment statuses.
        </p>
      </div>

      <div className="flex-1">
        <OrdersTable orders={data.orders} />
      </div>

      <OrderMetricsRow metrics={data.metrics} totalOrders={data.orders.length} />
    </div>
  );
};

export default AdminOrdersPage;