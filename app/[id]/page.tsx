// ...existing code...
import LikeButton from '../ui/like-button'
//문서의 import [getPost] from '@/lib/data' 대신 데이터만 직접 가져옵니다.
import { getPost } from '../lib/data'
import { notFound } from 'next/navigation' 

export default async function PostPage({
  params,
}: {
  params: { id: string } 
}) {
  const { id } = params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }
 
  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}