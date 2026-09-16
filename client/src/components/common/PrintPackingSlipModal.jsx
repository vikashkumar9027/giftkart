import React from 'react';
import { X, Printer, Package, Truck, Heart, Scissors, CheckSquare } from 'lucide-react';
import { formatDateTime, formatDate } from '../../utils/formatters';

const PrintPackingSlipModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto print:p-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity print:hidden"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 print:p-0">
        <div
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 sm:p-8 border border-stone-200 print:border-none print:shadow-none print:w-full print:p-2 text-stone-800 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Actions Bar (Hidden on Print) */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100 print:hidden">
            <div className="flex items-center space-x-2 text-rose-600">
              <Package className="w-5 h-5" />
              <span className="font-serif font-bold text-lg text-stone-900">
                Fulfillment & Warehouse Packing Slip
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Packing Slip */}
          <div id="printable-packing-slip" className="space-y-6 font-sans">
            {/* Header with Barcode representation */}
            <div className="flex justify-between items-start border-b-2 border-stone-900 pb-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                  GiftNest — Packaging Slip
                </h1>
                <p className="text-xs text-stone-500">Gifting Studio & Fulfillment Center</p>
                <p className="text-[11px] text-stone-400">Hub: SFO-Central-01 | Station: Pack-3</p>
              </div>

              <div className="text-right space-y-1">
                <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-md border border-stone-300">
                  AWB: {order.deliveryDetails?.trackingNumber || 'UNASSIGNED'}
                </span>
                <p className="text-xs font-bold text-rose-600">
                  Carrier: {order.deliveryDetails?.carrierName || 'Standard Express'}
                </p>
                <p className="text-[11px] text-stone-500">Order ID: #{order._id}</p>
                <p className="text-[11px] text-stone-400">Printed: {new Date().toLocaleString()}</p>
              </div>
            </div>

            {/* Recipient & Shipping Station Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-stone-200 rounded-xl p-4 bg-stone-50/50">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Deliver To Recipient:
                </span>
                <p className="text-sm font-bold text-stone-900">{order.deliveryAddress?.fullName}</p>
                <p>{order.deliveryAddress?.address}</p>
                <p className="font-bold">
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                </p>
                <p className="text-stone-600">Phone: {order.deliveryAddress?.phone}</p>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Delivery Specifications:
                </span>
                {order.deliveryDate ? (
                  <p className="font-bold text-rose-700">
                    Target Date: {formatDate(order.deliveryDate)}
                  </p>
                ) : (
                  <p className="font-semibold text-stone-700">Priority Dispatch (Express)</p>
                )}
                <p className="text-stone-600">Order Placed: {formatDateTime(order.createdAt)}</p>
                <p className="text-stone-600">
                  Agent: {order.deliveryDetails?.deliveryAgent?.name || 'Assigned on Dispatch'}
                </p>
                <span className="inline-block mt-1 text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                  FRAGILE — HANDLE WITH CARE
                </span>
              </div>
            </div>

            {/* Signature Packaging & Ribbon Requirements Banner */}
            <div className="border-2 border-rose-200 bg-rose-50/60 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-rose-700 font-bold">
                <Scissors className="w-4 h-4" />
                <span className="uppercase tracking-wider">Packaging Studio Instructions:</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-stone-800">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Box Specification:</span>
                  <p className="font-bold text-sm text-stone-900">
                    {order.giftPackaging?.name || 'Classic Eco-Kraft Box'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Ribbon Color Seal:</span>
                  <p className="font-bold text-sm text-rose-800">
                    {order.giftPackaging?.ribbonColor || 'Burgundy Silk'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block font-semibold">Card Placement:</span>
                  <p className="font-bold text-stone-900">Tucked Under Ribbon</p>
                </div>
              </div>
            </div>

            {/* Handwritten Greeting Card Note (Exact Text to inscribe) */}
            {order.giftMessage && (
              <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 bg-white text-xs space-y-2">
                <div className="flex items-center space-x-2 text-stone-700 font-bold">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span className="uppercase tracking-wider">
                    Greeting Card Inscription (Handwrite Inside Card):
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg italic font-serif text-sm text-stone-800 border border-stone-200">
                  "{order.giftMessage}"
                </div>
                {order.greetingCard?.senderName && (
                  <p className="text-right text-xs font-bold text-stone-600">
                    — From: {order.greetingCard.senderName}
                  </p>
                )}
              </div>
            )}

            {/* Items Pick List with Customization Specs */}
            <div className="border border-stone-300 rounded-xl overflow-hidden">
              <div className="bg-stone-100 p-2.5 font-bold text-xs uppercase tracking-wider text-stone-700 border-b border-stone-300">
                Warehouse Item Pick List & Customization Specs
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <tr>
                    <th className="p-2.5 w-12 text-center">Check</th>
                    <th className="p-2.5">Item & Custom Specifications</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="p-3 text-center">
                        <div className="w-5 h-5 border-2 border-stone-400 rounded mx-auto" />
                      </td>
                      <td className="p-3 space-y-1">
                        <p className="font-bold text-sm text-stone-900">{item.name}</p>
                        {item.customization?.customText && (
                          <div className="p-1.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 font-bold">
                            ✎ Engraving Text: "{item.customization.customText}"
                          </div>
                        )}
                        {item.customization?.recipientName && (
                          <p className="text-[11px] text-stone-600">
                            Plaque Name: <strong>{item.customization.recipientName}</strong>
                          </p>
                        )}
                        {item.customization?.customPhotoUrl && (
                          <div className="flex items-center space-x-2 text-[11px] text-emerald-700">
                            <span>Photo Attachment Attached:</span>
                            <span className="underline truncate max-w-xs">{item.customization.customPhotoUrl}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold text-sm text-stone-900">{item.quantity}</td>
                      <td className="p-3 text-right text-stone-500 font-mono">Aisle 3 / Shelf B</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quality & Packing Verification Sign-off */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-300 text-[11px] text-stone-600">
              <div>
                <span>Picked By: ___________________</span>
              </div>
              <div className="text-center">
                <span>Ribbon Sealed By: ___________________</span>
              </div>
              <div className="text-right">
                <span>Courier Handover Sign: ___________________</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPackingSlipModal;
