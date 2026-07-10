import LocationForm from "@/components/admin/LocationForm";

type Props = { params: { id: string } };

export default function EditLocationPage({ params }: Props) {
  return <LocationForm id={params.id} />;
}
