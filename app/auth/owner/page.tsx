"use client";
import { AuthTabs } from "../_components/AuthTabs";

/*
 * currently this is just the regular sign up page
 * later will need a different form where the business-owner will need to enter more details
 * maybe their address, SSN ??
 */
export default function Page() {
  return (
    <div className="min-h-screen ">
      <div className="min-h-full flex">
        <div className="py-8 flex-1 flex justify-center align-center">
          <div className="w-7/10">
            <AuthTabs />
          </div>
        </div>
        <div className="flex-1 min-h-screen py-14 text-center bg-white/10">
          <h1 className="text-3xl semibold mb-1">Sign up as a "Business owner"</h1>
          <p>benefits, benefits, benefits</p>
        </div>
      </div>
    </div>
  );
}
