type ProseContentProps = {
  html: string;
  className?: string;
};

export default function ProseContent({ html, className = "" }: ProseContentProps) {
  return (
    <div
      className={`prose prose-brand max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
