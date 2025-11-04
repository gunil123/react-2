'use client'

import React from 'react';
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
import Silde from 'acme-carousel' 
import './style.css'

export default function Gallery() {
    const [isOpen, setIsOpen] = useState(false);

    const items = [
        { id: '1', src: '[https://picsum.photos/id/1015/600/600](https://picsum.photos/id/1015/600/600)', alt: 'Landscape 1' },
        { id: '2', src: '[https://picsum.photos/id/1018/600/600](https://picsum.photos/id/1018/600/600)', alt: 'Landscape 2' },
        { id: '3', src: '[https://picsum.photos/id/1019/600/600](https://picsum.photos/id/1019/600/600)', alt: 'Landscape 3' },
    ]


    return (
        <div>
            <button onClick={() => setIsOpen(true)}>View pictures</button>
            {/* Works, since Carousel is used within a Client Component */}
            {isOpen && <Carousel items={items} />}
        </div>
    )
}