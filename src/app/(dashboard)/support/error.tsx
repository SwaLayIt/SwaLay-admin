"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const SupportError = ({ error, reset }: ErrorProps) => {
  return (
    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
      <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Something went wrong!</h3>
                <p className="text-sm text-muted-foreground">
                  There was an error loading the support tickets. Please try again.
                </p>
                {process.env.NODE_ENV === "development" && (
                  <details className="text-xs text-muted-foreground mt-2">
                    <summary className="cursor-pointer">Error details</summary>
                    <pre className="mt-2 text-left bg-muted p-2 rounded">
                      {error.message}
                    </pre>
                  </details>
                )}
              </div>
              <div className="flex space-x-2">
                <Button onClick={reset} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try again
                </Button>
                <Button 
                  variant="default"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportError;
