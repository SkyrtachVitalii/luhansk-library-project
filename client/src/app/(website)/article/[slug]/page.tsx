// src/app/news/[slug]/page.tsx

import { notFound } from "next/navigation";
import SingleOldPost from "@/components/SingleOldPost/SingleOldPost";
import { postsServerApi } from "@/api/posts.server";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  // Викликаємо ту саму функцію. 
  // Next.js НЕ буде робити другий запит, він візьме результат з кешу запиту Layout-а.
  const post = await postsServerApi.getPost(slug);

  if (!post) {
    notFound();
  }

  return <SingleOldPost post={post} />;
}