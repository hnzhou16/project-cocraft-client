"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {cn, layout, typography} from "@/utils/classnames";
import {activateAction} from "@/app/actions/activateAction";

export default function ActivatePage() {
  const {token} = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) return;


    async function activate() {
      const result = await activateAction(token as string);
      if (result.success) {
        setStatus("success");
        const timer = setTimeout(() => router.push("/login"), 3000);
        return () => clearTimeout(timer);
      } else {
        setStatus("error");
      }
    }

    activate();
  }, [token, router]);

  return (
    <div className={layout.container}>
      <div className="max-w-2xl mx-auto">
        {status === "loading" && <h2 className={cn(typography.h2, "text-center")}>Activating your account...</h2>}
        {status === "success" && <h2 className={cn(typography.h2, "text-center")}>Account activated! Redirecting to login...</h2>}
        {status === "error" && <h2 className={cn(typography.h2, "text-center")}>Activation failed. Link may be invalid or expired.</h2>}
      </div>
    </div>
  );
}