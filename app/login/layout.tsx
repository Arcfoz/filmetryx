import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

function FilmetryxLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width="140" viewBox="0 0 130.51 24.238">
      <text xmlSpace="preserve" x="-26.765" y="348.928" fill="#ffffff" strokeWidth="2.072" fontFamily="Satoshi" fontSize="24.86" fontWeight="900" transform="translate(45.505 -330.66)">
        <tspan x="-26.765" y="348.928" fontWeight="bold" className="font-custom">
          Filmetryx
        </tspan>
      </text>
      <path
        fill="#82c4ff"
        d="M.003 12.16c.058-.1.323-.456 4.866-6.544C6.366 3.61 7.713 1.8 7.862 1.595 8.236 1.08 8.773.594 9.19.392c.736-.355.943-.375 3.942-.376 1.55 0 2.819.02 2.819.044 0 .055-1.119 1.566-6.373 8.614-1.087 1.458-2.056 2.685-2.23 2.822a5 5 0 0 1-.807.479l-.502.237-3.046.022c-2.486.018-3.037.005-2.991-.074"
      ></path>
      <path
        fill="#82c4ff"
        d="M7.661 17.26c-.002-2.514.028-4.41.074-4.735.203-1.44 1.32-2.612 2.725-2.861.51-.09 6.043-.134 6.043-.048 0 .035-.262.416-.583.847a3144 3144 0 0 0-6.666 9c-1.063 1.445-1.485 1.99-1.537 1.99-.03 0-.054-1.887-.056-4.193"
      ></path>
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-background via-background/95 to-accent/5 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary))_0%,_transparent_50%)] opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <FilmetryxLogo />
        </div>

        <Suspense
          fallback={
            <Card className="w-full backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
              <div className="flex items-center justify-center p-6 sm:p-8">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground font-medium">Loading...</p>
                </div>
              </div>
            </Card>
          }
        >
          {children}
        </Suspense>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground/70">
          Powered by{" "}
          <span className="text-primary font-medium">The Movie Database</span>
        </div>
      </div>
    </div>
  );
}
