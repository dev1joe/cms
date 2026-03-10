"use client";
import { ProductsTab } from "./_components/ProductsTab";
import { useDashboardContext } from "../context";


export default function ProductsPage() {
  const { userId } = useDashboardContext();
  return (
    <ProductsTab userId={userId} />
  );
}
