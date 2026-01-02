import { redirect } from "next/navigation";

export async function GET() {
  redirect("/account/activity/posts");
}
