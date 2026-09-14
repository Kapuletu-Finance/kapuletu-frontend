import { UserDetailPage } from "@/features/admin/components/users/UserDetailPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <UserDetailPage />;
}
