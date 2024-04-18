"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/board');
  }, []);
  return (
    <main className={styles.main}>

    </main>
  );
}
