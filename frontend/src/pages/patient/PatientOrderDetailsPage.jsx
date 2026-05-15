import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Download } from 'lucide-react';
import { ecommerceApi } from '../../api/ecommerceApi';

import OrderSummaryHeaderCard from '../../components/patient/order-details/OrderSummaryHeaderCard';
import OrderedProductsCard from '../../components/patient/order-details/OrderedProductsCard';
import OrderInfoSidePanel from '../../components/patient/order-details/OrderInfoSidePanel';

const PatientOrderDetailsPage = () => {
  const { id } = useParams();

  const [orderDetails, setOrderDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [payment, setPayment] = useState(null);
  const [wellnessTip, setWellnessTip] = useState(null);

  useEffect(() => {
    // 🚨 FIX: Fail-fast security check. Block requests if ID is missing or literally the string "undefined"
    if (!id || id === 'undefined' || id === 'null') {
      console.warn("Invalid Order ID detected in URL. Aborting API calls.");
      return;
    }

    ecommerceApi.getOrderDetails(id).then(setOrderDetails).catch(console.error);
    ecommerceApi.getOrderedProducts(id).then(setProducts).catch(console.error);
    ecommerceApi.getDeliveryStatus(id).then(setDelivery).catch(console.error);
    ecommerceApi.getPaymentSummary(id).then(setPayment).catch(console.error);
    ecommerceApi.getOrderWellnessTip(id).then(setWellnessTip).catch(console.error);
  }, [id]);

  const handleDownloadInvoice = async () => {
    try {
      const blob = await ecommerceApi.downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert("Failed to download invoice.");
    }
  };

  return (
    <div className="bg-[#FDF9EE] min-h-full p-8 md:p-10 font-sans max-w-[1600px] mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Link to="/patient/pharmacy-orders" className="hover:text-[#4A7C59] transition-colors">Pharmacy</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900">Order {id}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order Details</h1>
        </div>
        <button onClick={handleDownloadInvoice} className="bg-[#3A6447] hover:bg-[#2C4D36] text-white font-bold py-3.5 px-6 rounded-full flex items-center gap-2 shadow-sm transition-colors text-sm">
          <Download size={18} /> Download Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {orderDetails ? <OrderSummaryHeaderCard order={orderDetails} delivery={delivery} /> : <div className="h-32 bg-white rounded-3xl animate-pulse"></div>}
          <OrderedProductsCard products={products} />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
          {payment && <OrderInfoSidePanel payment={payment} />}
          {wellnessTip && (
            <div className="bg-[#FDF3E1] border border-[#F5E6CC] rounded-3xl p-6">
              <span className="text-[10px] font-bold tracking-wider text-[#B8860B] uppercase block mb-2">WELLNESS TIP</span>
              <p className="text-sm text-gray-800 font-medium">{wellnessTip.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientOrderDetailsPage;