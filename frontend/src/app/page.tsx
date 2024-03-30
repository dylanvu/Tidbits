'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <div>
        Here is where you would upload media to be turned into tidbits
      </div>
      <button type="button" onClick={() => router.push('/browse')}>
      Browse
      </button>
    </main>
  );
}
