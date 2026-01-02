import React from "react";
function LoadingPage() {
  return (
    <div className="flex justify-center items-center h-dvh bg-linear-to-br from-primary to-secondary dark:to-heading">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default LoadingPage;
