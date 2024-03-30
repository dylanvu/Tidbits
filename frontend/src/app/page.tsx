'use client'

import { useRouter } from 'next/navigation'
import styles from "@/styles/Home.module.sass";

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <div className={styles.test}>
        Here is where you would upload media to be turned into tidbits
      </div>
      <button type="button" onClick={() => router.push('/browse')}>
      Browse
      </button>
    </main>
  );
}
