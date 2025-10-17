'use client'
 
import { useState } from 'react'
 
export default function LikeButton({ likes }: { likes: number }) {
    // Optimistic(낙관적 업데이트)
    //클라이언트 전용 컴포넌트=초기 likes 값을 상태로 관리
    const [count, setCount] = useState(likes ?? 0)
    const [isLiking, setIsLiking] = useState(false)

    const handleLike = async () => {
        //낙관적 업데이트
        setIsLiking(true)
        setCount((c) => c + 1)
        //실제 저장 로직(API 호출 등)

        setTimeout(() => setIsLiking(false),300)
}

    return (
        <button onClick={handleLike} disabled={isLiking} aria-pressed={false}>
        👍 {count} 
        </button>
    )
}