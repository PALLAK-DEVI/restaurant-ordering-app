import React from "react";
import { Order } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface KitchenOrderTicketProps {
  order: Order;
}

export function KitchenOrderTicket({ order }: KitchenOrderTicketProps) {
  return (
    <div id="kot-printable-area" className="hidden print:block bg-white text-black p-4 text-xs font-mono">
      <div className="text-center pb-2 border-b border-dashed border-black">
        <h2 className="text-base font-black uppercase">THE ROYAL TANDOOR</h2>
        <p className="text-[10px]">KITCHEN ORDER TICKET (KOT)</p>
        <p className="text-sm font-bold mt-1">ORDER #{order.orderNumber}</p>
        <p className="text-[10px] mt-0.5">{formatDateTime(order.placedAt)}</p>
      </div>

      <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[11px]">
        <div className="flex justify-between font-bold">
          <span>TYPE:</span>
          <span className="uppercase">{order.fulfilmentType}</span>
        </div>
        <div className="flex justify-between">
          <span>CUSTOMER:</span>
          <span>{order.guestName}</span>
        </div>
        <div className="flex justify-between">
          <span>PHONE:</span>
          <span>{order.guestPhone}</span>
        </div>
        {order.addressSnapshot && (
          <div className="text-[10px] pt-1">
            <span>ADDR: {order.addressSnapshot.line1}, {order.addressSnapshot.pincode}</span>
          </div>
        )}
      </div>

      {/* Items list */}
      <div className="py-2 border-b border-dashed border-black space-y-2">
        <div className="flex justify-between font-bold border-b border-black pb-1">
          <span>QTY / ITEM</span>
          <span>PRICE</span>
        </div>
        {order.items.map((item) => (
          <div key={item.id} className="space-y-0.5">
            <div className="flex justify-between font-bold text-xs">
              <span>{item.quantity}x {item.productNameSnapshot}</span>
              <span>{formatCurrency(item.lineTotal)}</span>
            </div>
            {item.variantSnapshot && (
              <p className="text-[10px] pl-2 font-semibold">[{item.variantSnapshot.name}]</p>
            )}
            {item.addonsSnapshot && item.addonsSnapshot.length > 0 && (
              <p className="text-[10px] pl-2">+ {item.addonsSnapshot.map((a) => a.name).join(", ")}</p>
            )}
            {item.itemNotes && (
              <p className="text-[10px] pl-2 italic font-bold text-black">
                NOTE: *** {item.itemNotes} ***
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[11px]">
        <div className="flex justify-between font-black text-xs">
          <span>TOTAL AMOUNT:</span>
          <span>{formatCurrency(order.grandTotal)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>PAYMENT:</span>
          <span className="uppercase font-bold">{order.paymentMethod} ({order.paymentStatus})</span>
        </div>
      </div>

      {order.customerNotes && (
        <div className="py-2 text-[10px] border-b border-dashed border-black">
          <p className="font-bold">INSTRUCTIONS:</p>
          <p>{order.customerNotes}</p>
        </div>
      )}

      <div className="text-center pt-2 text-[9px]">
        <span>*** END OF ORDER TICKET ***</span>
      </div>
    </div>
  );
}
