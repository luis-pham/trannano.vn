import PageForm from "@/components/admin/PageForm";

type Props = { params: { id: string } };

export default function EditPagePage({ params }: Props) {
  return <PageForm id={params.id} />;
}
