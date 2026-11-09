import ItemDetailClient from "./ItemDetailClient";
import { sampleProducts } from "@/lib/data/sample-data";

export function generateStaticParams() {
  return sampleProducts.map((p) => ({ slug: p.slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ItemDetailClient slug={params.slug} />;
}
