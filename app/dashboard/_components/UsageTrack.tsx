"use client";

import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { HISTORY } from "../history/page";
import { db } from "@/utils/db";
import { aiOutPut, UserSubscription } from "@/utils/schema";
import { eq } from "drizzle-orm";

function UsageTrack() {
  const { user } = useUser();
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const { userSubscription, setUserSubscription } = useContext(
    UserSubscriptionContext
  );
  const [maxWords, setMaxWords] = useState<number>(10000);
  const { updateCreditUsage, setUpdateCreditUsage } = useContext(
    UpdateCreditUsageContext
  );

  //   useEffect(() => {
  //     const fetchUsageData = async () => {
  //       if (user && user.primaryEmailAddress?.emailAddress) {
  //         try {
  //           const response = await fetch(
  //             `/api/usage?email=${encodeURIComponent(
  //               user.primaryEmailAddress.emailAddress
  //             )}`
  //           );
  //           const data = await response.json();

  //           if (response.ok && data.totalUsage !== undefined) {
  //             setTotalUsage(data.totalUsage);
  //             console.log(`Total word count: ${data.totalUsage}`);
  //           } else {
  //             console.error(
  //               "Error fetching usage or totalUsage is undefined:",
  //               data.error || "No totalUsage field"
  //             );
  //           }
  //         } catch (error) {
  //           console.error("Fetch error:", error);
  //         }
  //       } else {
  //         console.error("User's primary email address is missing or undefined.");
  //       }
  //     };

  //     fetchUsageData();
  //   }, [user, setTotalUsage]);

  useEffect(() => {
    user && GetData();
    user && IsUserSubscribe();
  }, [user]);

  useEffect(() => {
    user && GetData();
  }, [updateCreditUsage && user]);

  const GetData = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.error("Email address is undefined");
      return;
    }
    const result: HISTORY[] = await db
      .select()
      .from(aiOutPut)
      .where(eq(aiOutPut.createdBy, user.primaryEmailAddress.emailAddress));

    GetTotalUsage(result);
  };

  const IsUserSubscribe = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.error("Email address is undefined");
      return;
    }
    const result = await db
      .select()
      .from(UserSubscription)
      .where(
        eq(UserSubscription.email, user?.primaryEmailAddress?.emailAddress)
      );
    console.log(result);
    if (result.length > 0) {
      setUserSubscription(true);
      setMaxWords(100000);
    }
  };

  const GetTotalUsage = (result: HISTORY[]) => {
    let total: number = 0;
    result.forEach((element) => {
      total = total + Number(element.aiResponse?.length);
    });
    setTotalUsage(total);
    console.log(total);
  };

  return (
    <div className="m-5">
      <div className="bg-primary text-white rounded-lg p-3">
        <h2 className="font-medium">Credits</h2>
        <div className="h-2 bg-[#9981f9] rounded-full mt-3">
          <div
            className="h-2 bg-white rounded-full"
            style={{
              width:
                totalUsage / maxWords > 1
                  ? 100 + "%"
                  : (totalUsage / maxWords) * 100 + "%",
            }}
          ></div>
        </div>
        <h2 className="text-sm my-2">
          {totalUsage}/{maxWords} credit used
        </h2>
      </div>
      <Link href="/dashboard/billing">
        <button
          className={`w-full text-blue-800 font-medium border-2 border-gray-300 rounded-xl text-center mt-3 p-2 ${
            userSubscription && "cursor-not-allowed"
          }`}
          disabled={!!userSubscription}
        >
          {userSubscription ? "Subscribed" : "Upgrade"}
        </button>
      </Link>
    </div>
  );
}

export default UsageTrack;
