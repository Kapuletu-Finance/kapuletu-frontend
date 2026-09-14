import { redirect } from "next/navigation";

export default function AdminFinancePlansRedirect() {
  // Redirect to the main finance page where the plans are listed
  redirect("/admin/finance");
}
