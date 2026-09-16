import React from 'react';
import { X, Printer, Gift, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const PrintReceiptModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = order.paymentInfo?.status === 'Paid';
  const paymentMethodLabel = {
    card: 'Credit / Debit Card',
    upi: 'UPI & QR Code Scan',
    netbanking: 'Internet Banking',
    cod: 'Cash on Delivery',
  }[order.paymentInfo?.method || 'card'] || 'Direct Payment';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto print:p-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity print:hidden"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 print:p-0">
        <div
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 border border-stone-200 print:border-none print:shadow-none print:w-full print:p-4 text-stone-800 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Actions Bar (Hidden on Print) */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100 print:hidden">
            <div className="flex items-center space-x-2 text-rose-600">
              <Gift className="w-5 h-5" />
              <span className="font-serif font-bold text-lg text-stone-900">Tax Invoice & Receipt</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold shadow-md shadow-rose-200 flex items-center space-x-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Receipt Content */}
          <div id="printable-receipt" className="space-y-6">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-stone-200 pb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-serif font-bold text-stone-900">GiftNest</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">Artisanal Gifting & Curated Surprises</p>
                <p className="text-[11px] text-stone-400">45 Blossom Avenue, San Francisco, CA</p>
                <p className="text-[11px] text-stone-400">support@giftnest.com | +1 (800) 443-8637</p>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                  Tax Invoice
                </span>
                <p className="text-xs font-mono font-bold text-stone-800 mt-1">
                  Invoice #: INV-{order._id?.slice(-8).toUpperCase()}
                </p>
                <p className="text-[11px] text-stone-500">
                  Date: {formatDateTime(order.createdAt)}
                </p>
                <div className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isPaid ? 'Payment Confirmed' : order.paymentInfo?.status || 'Pending'}</span>
                </div>
              </div>
            </div>

            {/* Recipient & Payment Details Grid */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Billed & Delivered To:
                </span>
                <p className="font-bold text-stone-900">{order.deliveryAddress?.fullName}</p>
                <p className="text-stone-600">{order.deliveryAddress?.address}</p>
                <p className="text-stone-600">
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                </p>
                <p className="text-stone-500">Phone: {order.deliveryAddress?.phone}</p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Payment Details:
                </span>
                <p className="font-bold text-stone-900">{paymentMethodLabel}</p>
                {order.paymentInfo?.transactionId && (
                  <p className="font-mono text-[11px] text-stone-600">
                    Txn ID: {order.paymentInfo.transactionId}
                  </p>
                )}
                {order.deliveryDetails?.trackingNumber && (
                  <p className="font-mono text-[11px] text-rose-600 font-semibold">
                    AWB: {order.deliveryDetails.trackingNumber} ({order.deliveryDetails.carrierName})
                  </p>
                )}
                <p className="text-stone-500 text-[11px]">Status: {order.status}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Gift Item Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 space-y-0.5">
                        <p className="font-bold text-stone-800">{item.name}</p>
                        {item.customization?.customText && (
                          <p className="text-[11px] text-rose-600 font-medium">
                            Engraving: "{item.customization.customText}"
                          </p>
                        )}
                        {item.customization?.recipientName && (
                          <p className="text-[10px] text-stone-500">
                            Recipient: {item.customization.recipientName}
                          </p>
                        )}
                        {item.packaging?.name && (
                          <p className="text-[10px] text-amber-700 font-medium">
                            Packing: {item.packaging.name} ({item.packaging.ribbonColor || 'Satin Ribbon'})
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold text-stone-700">{item.quantity}</td>
                      <td className="p-3 text-right text-stone-600">{formatCurrency(item.price)}</td>
                      <td className="p-3 text-right font-bold text-stone-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                  {/* Luxury Gift Packaging Line if selected */}
                  {order.giftPackaging && order.giftPackaging.price > 0 && (
                    <tr className="bg-rose-50/40">
                      <td className="p-3 font-semibold text-rose-900">
                        Signature Packaging: {order.giftPackaging.name} ({order.giftPackaging.ribbonColor})
                      </td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right text-stone-600">{formatCurrency(order.giftPackaging.price)}</td>
                      <td className="p-3 text-right font-bold text-stone-900">
                        {formatCurrency(order.giftPackaging.price)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations & Total */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-stone-800">
                    {formatCurrency(
                      order.items?.reduce((acc, i) => acc + i.price * i.quantity, 0) || order.totalAmount
                    )}
                  </span>
                </div>
                {order.giftPackaging?.price > 0 && (
                  <div className="flex justify-between">
                    <span>Luxury Packaging:</span>
                    <span className="font-bold text-stone-800">
                      {formatCurrency(order.giftPackaging.price)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping & Delivery:</span>
                  <span className="font-bold text-emerald-600">Included</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total Paid / Due:</span>
                  <span className="text-rose-600 font-serif text-base">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Greeting Note Inscription if provided */}
            {order.giftMessage && (
              <div className="bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100 text-xs space-y-1">
                <span className="font-bold text-rose-800 text-[11px] uppercase tracking-wider block">
                  Enclosed Handwritten Greeting Card Note:
                </span>
                <p className="italic text-stone-700">"{order.giftMessage}"</p>
                {order.greetingCard?.senderName && (
                  <p className="text-right text-[11px] font-bold text-stone-600">
                    — From {order.greetingCard.senderName}
                  </p>
                )}
              </div>
            )}

            {/* Footer Notice */}
            <div className="pt-4 border-t border-stone-200 text-center text-[10px] text-stone-400 space-y-1">
              <p>Thank you for letting GiftNest craft your celebratory surprise!</p>
              <p>This is a computer-generated invoice and does not require a physical signature.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintReceiptModal;
