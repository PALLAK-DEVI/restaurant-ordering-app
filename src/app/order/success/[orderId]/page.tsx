import OrderSuccessClient from "./OrderSuccessClient";

export function generateStaticParams() {
  return [
    { orderId: "ord-seed-1" },
    { orderId: "ord-seed-2" },
    { orderId: "ord-seed-3" },
    { orderId: "ord_demo_101" },
  ];
}

export default function Page({ params }: { params: { orderId: string } }) {
  return <OrderSuccessClient orderId={params.orderId} />;
}
