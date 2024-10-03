"use client";

import React, { useContext, useState } from "react";
import FormSection from "../_component/FormSection";
import OutputSection from "../_component/OutputSection";
import { TEMPLATE } from "../../_components/TemplateListSection";
import Templates from "@/app/(data)/Templates";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { chatSession } from "@/utils/AiModel";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { aiOutPut } from "@/utils/schema";
import { db } from "@/utils/db";
import { toast } from "react-toastify";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { UserSubscriptionContext } from "@/app/(context)/UserSubscriptionContext";
import { UpdateCreditUsageContext } from "@/app/(context)/UpdateCreditUsageContext";

interface PROPS {
  params: {
    "template-slug": string;
  };
}

function CreateNewContent(props: PROPS) {
  const selectedTemplate: TEMPLATE | undefined = Templates.find(
    (item) => item.slug === props.params["template-slug"]
  );
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [aiOutput, setAiOutput] = useState<string>("");
  const router = useRouter();
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const { userSubscription, setUserSubscription } = useContext(
    UserSubscriptionContext
  );
  const { updateCreditUsage, setUpdateCreditUsage } = useContext(
    UpdateCreditUsageContext
  );

  const GenerateAIContent = async (formData: any) => {
    if (totalUsage >= 10000 && !userSubscription) {
      console.log("Please Upgrade");
      router.push("/dashboard/billing");
      return;
    }
    setLoading(true);
    const SelectedPrompt = selectedTemplate?.aiPrompt;
    const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;

    const result = await chatSession.sendMessage(FinalAIPrompt);
    const aiResponseText = result.response.text();

    setAiOutput(aiResponseText);

    await SaveInDb(formData, selectedTemplate?.slug, aiResponseText);
    setLoading(false);
    setUpdateCreditUsage(Date.now());
  };

  //   const SaveInDb = async (formData: any, slug: any, aiResp: string | null) => {
  //     try {
  //       const response = await fetch("/api/save-content", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           formData,
  //           slug,
  //           aiResponse: aiResp,
  //           createdBy: user?.primaryEmailAddress?.emailAddress,
  //         }),
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         console.error("Error saving to database:", errorData); // Log the error details
  //       } else {
  //         const resultData = await response.json(); // Log the result data
  //         console.log("Successfully saved to database:", resultData); // This will include the `result` from the API
  //       }
  //     } catch (error) {
  //       console.error("Error saving content:", error); // Log any other errors
  //     }
  //   };

  const SaveInDb = async (formData: any, slug: any, aiResp: string) => {
    try {
      const result = await db.insert(aiOutPut).values({
        formData: formData,
        templateSlug: slug,
        aiResponse: aiResp,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD/MM/YYYY"),
      });
      console.log("Database insert result:", result);
    } catch (error) {
      console.error("Error saving to database:", error);
      toast.error("Failed to save the generated content. Please try again.");
    }
  };

  return (
    <div className="lg:p-10 p-5">
      <Link href="/dashboard">
        <Button>
          <ArrowLeftCircle />
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={(v: any) => GenerateAIContent(v)}
          loading={loading}
        />

        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  );
}

export default CreateNewContent;
