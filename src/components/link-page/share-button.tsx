"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { profile } from "@/config/profile";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: profile.name,
        text: profile.intro,
        url: shareUrl
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const Icon = copied ? Check : Share2;

  return (
    <Button
      aria-label={copied ? "已複製連結" : "分享頁面"}
      className="bg-card/85 backdrop-blur hover:bg-card"
      onClick={handleShare}
      size="icon"
      type="button"
      variant="outline"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
