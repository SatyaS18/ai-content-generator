import { UserProfile } from "@clerk/nextjs";
import React from "react";

function Settings() {
  return (
    <div className="flex items-center justify-center my-5">
      <UserProfile />
    </div>
  );
}

export default Settings;
