'use client'

import { useRouter } from 'next/navigation'

export default function Browse() {
    const router = useRouter();
    return (
        <main>
            <div>
            Here is where you would look at the reel organization structure and view reels
            </div>
            <button type="button" onClick={() => router.push('/browse')}>
                Browse
            </button>
        </main>
    );
}
