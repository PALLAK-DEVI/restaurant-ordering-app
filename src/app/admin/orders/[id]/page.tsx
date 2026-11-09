import AdminOrderDetailClient from "./AdminOrderDetailClient";

export function generateStaticParams() {
  return [
    { id: "ord-seed-1" },
    { id: "ord-seed-2" },
    { id: "ord-seed-3" },
    { id: "ord_demo_101" },
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return <AdminOrderDetailClient id={params.id} />;
}
