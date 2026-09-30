"use client";

import { trackingHeadline, trackingSteps, resolveFulfillmentStage } from "@/lib/orderTracking";
import axios from "axios";
import { useEffect, useState } from "react";
import useVisiblePoll from "@/hooks/useVisiblePoll";

const OrderLiveTracker = ({ orderId, initial }) => {
  const [track, setTrack] = useState(() => ({
    fulfillmentStage: resolveFulfillmentStage(initial || {}),
    prepMinutes: initial?.prepMinutes || 20,
    serviceType: initial?.serviceType || "delivery",
    branchName: initial?.branchName || "",
    stageUpdatedAt: initial?.stageUpdatedAt || initial?.createdAt,
    createdAt: initial?.createdAt,
    headline: trackingHeadline(initial || {}),
  }));
  const [, setTick] = useState(0);

  useEffect(() => {
    const clock = setInterval(() => setTick((value) => value + 1), 15000);
    return () => clearInterval(clock);
  }, []);

  useVisiblePoll(async () => {
    if (!orderId) return;
    try {
      const { data } = await axios.get(`/api/orders/track/${orderId}`);
      if (data?.success) setTrack((current) => ({ ...current, ...data.data }));
    } catch {
      // keep the last known step
    }
  }, orderId ? 4000 : 0);

  const stage = resolveFulfillmentStage(track);
  const steps = trackingSteps(track.serviceType);
  const activeIndex = steps.findIndex((step) => step.key === stage);
  const headline = trackingHeadline(track);

  if (stage === "cancelled") {
    return (
      <div className="mb-10 rounded-[22px] border border-[#f1e3d4] bg-white px-5 py-5 text-[#3a2416]">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#E45700]">Order update</p>
        <p className="mt-1 font-display text-[1.6rem] font-semibold">This order was cancelled</p>
      </div>
    );
  }

  return (
    <div className="mb-10 rounded-[22px] border border-[#f1e3d4] bg-white px-4 py-5 text-[#3a2416] shadow-[0_10px_28px_rgba(75,46,30,0.06)] sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#E45700]">
            {track.serviceType === "pickup" ? "Counter pickup" : "Delivery"}
            {track.branchName ? ` · ${track.branchName}` : ""}
          </p>
          <p className="mt-1 font-display text-[1.8rem] font-semibold leading-none tracking-[-0.03em] sm:text-[2.2rem]">
            {headline}
          </p>
        </div>
        <p className="text-[13px] text-[#8a6754]">Updates on its own</p>
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const done = activeIndex > index || stage === "delivered";
          const current = index === activeIndex && stage !== "delivered";
          return (
            <li
              key={step.key}
              className={`rounded-2xl border px-3 py-3 ${
                current
                  ? "border-[#E45700] bg-[#fff4ec]"
                  : done
                    ? "border-[#ead9c6] bg-[#FFF8F2]"
                    : "border-[#f1e3d4] bg-white"
              }`}
            >
              <p className={`text-[11px] font-bold uppercase tracking-[0.12em] ${current || done ? "text-[#E45700]" : "text-[#b7a498]"}`}>
                Step {index + 1}
              </p>
              <p className={`mt-1 text-[14px] font-bold ${current || done ? "text-[#3a2416]" : "text-[#9a8170]"}`}>
                {step.label}
              </p>
              {step.key === "preparing" && (stage === "received" || stage === "preparing") && (
                <p className="mt-1 text-[12px] text-[#8a6754]">About {track.prepMinutes || 20} min</p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default OrderLiveTracker;
