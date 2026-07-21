"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateLead, type LeadStatus } from "@/lib/analytics-store";

export async function updateLeadAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "new") as LeadStatus;
  const internalNotes = String(formData.get("internalNotes") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid lead id");

  await updateLead(id, status, internalNotes);
  revalidatePath("/admin/analytics");
}
