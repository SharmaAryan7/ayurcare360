import React, { useState, useEffect } from 'react';
import { ecommerceApi } from '../../api/ecommerceApi';
import OrderMetricsRow from '../../components/patient/pharmacy-orders/OrderMetricsRow';
import OrderHistoryList from '../../components/patient/pharmacy-orders/OrderHistoryList';
import RefillReminderCard from '../../components/patient/pharmacy-orders/RefillReminderCard';
import PharmacyHelpCard from '../../components/patient/pharmacy-orders/PharmacyHelpCard';

const PharmacyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({ inProgress: 0, shippedToday: 0, totalSpent: 0 });
  const [refillData, setRefillData] = useState(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    // Fetch History Table
    ecommerceApi.getOrderHistory()
      .then(data => {
        const fetchedOrders = data.orders || data || [];
        setOrders(fetchedOrders);

        // --- DYNAMIC REFILL LOGIC ---
        if (fetchedOrders.length > 0) {
          // Sort orders to find the most recent one
          const sortedOrders = [...fetchedOrders].sort((a, b) => 
            new Date(b.created_at || b.order_date) - new Date(a.created_at || a.order_date)
          );
          const latestOrder = sortedOrders[0];

          // Ensure the order has items to recommend a refill for
          if (latestOrder && latestOrder.items && latestOrder.items.length > 0) {
            const item = latestOrder.items[0]; // Track the first item in the latest order
            const orderDate = new Date(latestOrder.created_at || latestOrder.order_date || new Date());
            const today = new Date();
            
            // Calculate days passed since order
            const diffTime = Math.abs(today - orderDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Assume a standard medicine supply lasts 30 days
            const assumedSupply = 30; 
            let daysLeft = assumedSupply - diffDays;
            
            // If negative, they are already out. Fix it to 0.
            if (daysLeft < 0) daysLeft = 0;

            setRefillData({
              productName: item.name || item.product_name || 'Wellness Supplement',
              orderId: latestOrder.id || latestOrder.order_id || latestOrder._id || 'Recent',
              daysLeft: daysLeft
            });
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingOrders(false));

    // Fetch Metrics Aggregations
    Promise.all([
      ecommerceApi.getInProgressOrders(),
      ecommerceApi.getShippedToday(),
      ecommerceApi.getTotalSpent()
    ]).then(([inProg, shipped, spent]) => {
      setMetrics({
        inProgress: inProg.count || 0,
        shippedToday: shipped.count || 0,
        totalSpent: spent.total || 0
      });
    }).catch(console.error);
  }, []);

  return (
    <div className="bg-[#FDF9EE] min-h-full p-8 md:p-10 font-sans max-w-[1600px] mx-auto flex flex-col">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Pharmacy Orders</h1>
      </div>

      <OrderMetricsRow metrics={metrics} />

      <div className="mb-8 flex-1">
        <OrderHistoryList orders={orders} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pass the calculated data and loading state */}
        <RefillReminderCard data={refillData} isLoading={isLoadingOrders} />
        <PharmacyHelpCard />
      </div>
    </div>
  );
};

export default PharmacyOrdersPage;