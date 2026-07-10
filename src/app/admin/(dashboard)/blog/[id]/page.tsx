import BlogForm from "@/components/admin/BlogForm";

type Props = { params: { id: string } };

export default function EditBlogPage({ params }: Props) {
  return <BlogForm id={params.id} />;
}
