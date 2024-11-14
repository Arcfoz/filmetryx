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
  }, [session, searchParams, status]);

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
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login with TMDB</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleLogin}
          className="w-full"
          disabled={isLoading || isAuthenticating}
        >
          {isLoading || isAuthenticating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isAuthenticating ? "Authenticating..." : "Please wait..."}
            </>
          ) : (
            "Authenticate with TMDB"
          )}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          You will be redirected to TMDB to complete the login process
        </p>
      </CardContent>
    </Card>
  );
}