import Posts from '@/components/posts'
import { Suspense } from 'react'

export default function Page() {
  // Don't await the data fetching function
  // const posts = getPosts()
  const posts = fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json())

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}