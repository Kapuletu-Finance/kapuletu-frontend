import { FeedbackDetailPage } from "@/features/admin/components/feedback/FeedbackDetailPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <FeedbackDetailPage />;
}
