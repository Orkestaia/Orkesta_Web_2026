"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Chunk propio, diferido: nunca bloquea el LCP ni cuenta contra él.
const NodeField = dynamic(() => import("./NodeField"), { ssr: false });

type NavigatorConnection = Navigator & { connection?: { saveData?: boolean } };

/**
 * Gate del campo de nodos — brief §5b.3: se apaga con prefers-reduced-motion,
 * con saveData y por debajo de 768px (ahí queda solo la silueta).
 * Se monta después de la hidratación.
 */
export function NodeFieldGate() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const allowed =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.innerWidth >= 768 &&
      !(navigator as NavigatorConnection).connection?.saveData;
    setOk(allowed);
  }, []);

  if (!ok) return null;
  return <NodeField />;
}
