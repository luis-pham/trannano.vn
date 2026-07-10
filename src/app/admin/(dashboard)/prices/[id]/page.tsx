import PriceForm from "@/components/admin/PriceForm";

type Props = { params: { id: string } };

export default function EditPricePage({ params }: Props) {
  return <PriceForm id={params.id} />;
}
