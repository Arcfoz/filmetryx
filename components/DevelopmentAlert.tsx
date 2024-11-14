"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const DevelopmentAlert = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Alert className="relative rounded-none border-0 bg-yellow-100 dark:bg-yellow-900">
      <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
        <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-100">🚧 This website is currently in development stage.</AlertDescription>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-yellow-200 dark:hover:bg-yellow-800" onClick={handleDismiss}>
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </Alert>
  );
};

export default DevelopmentAlert;
