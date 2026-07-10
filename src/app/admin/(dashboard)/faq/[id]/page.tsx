import FaqForm from "@/components/admin/FaqForm";

type Props = { params: { id: string } };

export default function EditFaqPage({ params }: Props) {
  return <FaqForm id={params.id} />;
}
