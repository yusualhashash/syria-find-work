"use server"

import { deleteSession } from "@/lib/server-actions"
import { redirect } from "next/navigation"

export async function logoutUser() {
  await deleteSession()
  redirect("/login")
}
