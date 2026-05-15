import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

import OrderSummaryHeader from '../../components/admin/orders/order-details/OrderSummaryHeader';
import CustomerInfoCard from '../../components/admin/orders/order-details/CustomerInfoCard';
import ItemsOrderedTable from '../../components/admin/orders/order-details/ItemsOrderedTable';
import PaymentSummaryCard from '../../components/admin/orders/order-details/PaymentSummaryCard';
import OrderTimeline from '../../components/admin/orders/order-details/OrderTimeline';

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState({
    basic: null, items: [], customer: null, timeline: [], summary: null
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const [basicRes, itemsRes, custRes, timeRes, sumRes] = await Promise.all([
          adminApi.getOrderBasicDetails(id),
          adminApi.getOrderItems(id),
          adminApi.getOrderCustomerDetails(id),
          adminApi.getOrderTimeline(id),
          adminApi.getOrderPaymentSummary(id)
        ]);

        setOrderData({
          basic: basicRes.success ? basicRes : null,
          items: itemsRes.items || [],
          customer: custRes.success ? custRes : null,
          timeline: timeRes.timeline || [],
          summary: sumRes.summary || null
        });
      } catch (error) {
        console.error("Failed to load order details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (isLoading || !orderData.basic) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <div className="flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">
          <Link to="/admin/orders" className="hover:text-[#3A6447] transition-colors">Orders</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900">Details</span>
        </div>
        <h1 className="text-3xl md:text-[32px] font-extrabold text-green-700 tracking-tight leading-none mb-2">
          Order Details
        </h1>
        <p className="text-sm font-medium text-amber-800">
          Viewing specific details for order #{orderData.basic.order_number}
        </p>
      </div>

      <OrderSummaryHeader order={orderData.basic} orderId={id} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <ItemsOrderedTable items={orderData.items} />
          <OrderTimeline timeline={orderData.timeline} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
          <CustomerInfoCard customer={orderData.customer} />
          <PaymentSummaryCard summary={orderData.summary} />
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;