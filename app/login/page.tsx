"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        if (status === "loading") return;

        if (session) {
          router.replace("/");
          return;
        }

        const approved = searchParams.get("approved");
        const denied = searchParams.get("denied");
        const token = searchParams.get("request_token");

        if (denied) {
          toast.error("Authentication was denied", {
            position: "bottom-center",
          });
          router.replace("/login");
          return;
        }

        if (approved && token && !isAuthenticating) {
          setIsAuthenticating(true);
          const result = await signIn("tmdb", {
            requestToken: token,
            redirect: false,
          });

          if (result?.error) {
            toast.error("Authentication failed, try again", {
              position: "bottom-center",
            });
            router.replace("/login");
          } else if (result?.ok) {
            router.replace("/");
            toast.success("Login Successfully", {
              position: "bottom-center",
            });
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast.error("Something went wrong", {
          position: "bottom-center",
        });
      } finally {
        setIsAuthenticating(false);
      }
    };

    handleAuth();
  }, [session, searchParams, status, isAuthenticating, router]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_URL}/authentication/token/new?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("tmdb_request_token", data.request_token);
        window.location.href = `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${window.location.origin}/login`;
      } else {
        throw new Error("Failed to get request token");
      }
    } catch (error) {
      console.error("Error getting request token:", error);
      toast.error("Failed to initialize login process", {
        position: "bottom-center",
      });
      setIsLoading(false);
    }
  };


  if (status === "loading" || session) {
    return null;
  }

  return (
    <Card className="w-full backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
      <CardHeader className="text-center pb-4 px-6 sm:px-8 pt-6 sm:pt-8">
        <CardTitle className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-red-hat-display)] text-foreground mb-2">
          Welcome Back
        </CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base px-2">
          Sign in to access your personalized movie experience
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-6 sm:px-8 pb-6 sm:pb-8">
        {/* Demo Account Info */}
        <div className="text-center text-xs text-muted-foreground/70 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="font-medium text-blue-400 mb-2">Demo Account Available</p>
          <p>Username: <span className="font-mono text-foreground">filmetryx</span></p>
          <p>Password: <span className="font-mono text-foreground">1234</span></p>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent/20 border border-border/30">
            <div className="w-5 h-5 bg-[#01B4E4] rounded flex items-center justify-center">
              <span className="text-xs font-bold text-white">T</span>
            </div>
            <span className="text-sm font-medium text-foreground">TMDB Account</span>
          </div>
        </div>

        <Button
          onClick={handleLogin}
          className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
          disabled={isLoading || isAuthenticating}
        >
          {isLoading || isAuthenticating ? (
            <>
              <Loader2 className="mr-2 sm:mr-3 h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
              <span>{isAuthenticating ? "Authenticating..." : "Preparing login..."}</span>
            </>
          ) : (
            <>
              <span>Continue with TMDB</span>
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
            You&apos;ll be securely redirected to The Movie Database
          </p>
        </div>
      </CardContent>
    </Card>
  );
}