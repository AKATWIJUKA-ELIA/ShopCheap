"use client";
import Loader from "@/components/Loader/loader";
export default function RootLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center  ">
      <span className="animate-pulse text-xl font-semibold text-blue-600">
        <Loader />
      </span>
    </div>
  );
}