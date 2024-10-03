import React from "react";
import MemeGenerator from "./_component/MemeGeneratorPage";

function meme() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center">
      <MemeGenerator />
    </div>
  );
}

export default meme;
