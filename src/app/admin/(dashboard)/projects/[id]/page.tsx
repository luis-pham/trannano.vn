import ProjectForm from "@/components/admin/ProjectForm";

type Props = { params: { id: string } };

export default function EditProjectPage({ params }: Props) {
  return <ProjectForm id={params.id} />;
}
