"use client";
import { useRouter } from "next/navigation";
import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import { SectionCards } from "./_components/section-cards";

import data from "./data.json"
import { useSession } from "../../../context/sessionContext";

export default function Dashboard() {
  const router = useRouter();
  const { session, isPending, error } = useSession();

  if (isPending) {
    return ("loading...");
  }

  if (!session || error) {
    return router.push("/auth");
  }

  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
