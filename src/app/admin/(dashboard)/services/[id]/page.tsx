import ServiceForm from "@/components/admin/ServiceForm";

type Props = { params: { id: string } };

export default function EditServicePage({ params }: Props) {
  return <ServiceForm id={params.id} />;
}
