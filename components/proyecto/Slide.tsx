import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FlowDiagram } from "@/components/proyecto/FlowDiagram";
import { CAL_URL } from "@/lib/site";
import type { Proyecto, Slide as SlideDatos } from "@/lib/proyectos";

/**
 * Una diapositiva del deck — brief §4.
 * Una idea por pantalla, escala tipográfica agresiva y un solo acento cyan.
 */
export function Slide({
  slide,
  proyecto,
  indice,
  total,
}: {
  slide: SlideDatos;
  proyecto: Proyecto;
  indice: number;
  total: number;
}) {
  return (
    <section
      className="ork-slide"
      aria-label={`${indice + 1} de ${total}`}
      aria-roledescription="diapositiva"
      // Recibe el foco al cambiar de diapositiva, sin entrar en el orden de Tab
      tabIndex={-1}
    >
      <div className="ork-slide__interior">{contenido(slide, proyecto)}</div>
    </section>
  );
}

function contenido(slide: SlideDatos, proyecto: Proyecto) {
  switch (slide.tipo) {
    case "portada":
      return (
        <div className="text-center">
          {proyecto.logo ? (
            <Image
              src={proyecto.logo}
              alt=""
              width={320}
              height={160}
              priority
              sizes="(max-width: 767px) 60vw, 320px"
              className="mx-auto mb-12 max-h-[104px] w-auto object-contain"
            />
          ) : (
            <p
              aria-hidden="true"
              className="mb-12 font-display text-[4rem] leading-none font-bold text-ork-text-muted"
            >
              {proyecto.iniciales}
            </p>
          )}
          <h1 className="mx-auto max-w-[18ch] font-display text-display font-bold text-balance text-ork-text">
            {proyecto.titular}
          </h1>
          <p className="mt-10 font-mono text-mono-label tracking-[0.12em] text-ork-cyan uppercase">
            {proyecto.cliente} · {proyecto.sector} · {proyecto.pais} · {proyecto.anio}
          </p>
        </div>
      );

    case "frase":
      return (
        <div className="text-center">
          <p className="mx-auto max-w-[22ch] font-display text-display leading-[1.05] font-bold text-balance text-ork-text">
            {slide.texto}
          </p>
          {slide.pie ? (
            <p className="mx-auto mt-10 max-w-[60ch] text-body-lg text-ork-text-muted">
              {slide.pie}
            </p>
          ) : null}
        </div>
      );

    case "cifra":
      return (
        <div className="text-center">
          <p className="font-display text-[clamp(4.5rem,17vw,13rem)] leading-[0.9] font-bold tracking-[-0.04em] text-ork-cyan-hi">
            {slide.valor}
          </p>
          <p className="mx-auto mt-10 max-w-[26ch] text-balance text-h3 text-ork-text">
            {slide.etiqueta}
          </p>
          {slide.nota ? (
            <p className="mx-auto mt-6 max-w-[46ch] font-mono text-mono-label tracking-[0.12em] text-ork-text-muted uppercase">
              {slide.nota}
            </p>
          ) : null}
        </div>
      );

    case "lista":
      return (
        <div className="mx-auto w-full max-w-[52rem]">
          <h2 className="font-display text-h2 font-bold text-balance text-ork-text">
            {slide.titulo}
          </h2>
          <ul className="mt-12 space-y-6">
            {slide.puntos.map((p, i) => (
              <li key={p.texto} className="flex items-start gap-5">
                <span
                  aria-hidden="true"
                  className="mt-1 font-mono text-mono-label tracking-[0.12em] text-ork-cyan"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-body-lg text-ork-text">{p.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "diagrama":
      return (
        <div className="mx-auto w-full max-w-[64rem]">
          <h2 className="text-center font-display text-h3 font-bold text-ork-text">
            {slide.titulo}
          </h2>
          <div className="mt-10 overflow-x-auto">
            <div className="min-w-[38rem]">
              <FlowDiagram nodos={slide.nodos} aristas={slide.aristas} titulo={slide.titulo} />
            </div>
          </div>
          {slide.pie ? (
            <p className="mx-auto mt-8 max-w-[60ch] text-center text-body text-ork-text-muted">
              {slide.pie}
            </p>
          ) : null}
        </div>
      );

    case "imagen":
      return (
        <figure className="flex h-full w-full flex-col justify-center">
          <div className="relative mx-auto w-full max-w-[72rem] overflow-hidden rounded-xl border border-ork-border">
            <Image
              src={slide.imagen.src}
              alt={slide.imagen.alt}
              width={slide.imagen.ancho}
              height={slide.imagen.alto}
              sizes="(max-width: 767px) 92vw, 72rem"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mx-auto mt-8 max-w-[60ch] text-center text-body text-ork-text-muted">
            {slide.pie}
          </figcaption>
        </figure>
      );

    case "comparativa":
      return (
        <figure className="mx-auto w-full max-w-[72rem]">
          <div className="grid gap-5 sm:grid-cols-2">
            {[slide.antes, slide.despues].map((img, i) => (
              <div key={img.src} className="overflow-hidden rounded-xl border border-ork-border">
                <p className="border-b border-ork-border px-4 py-2 font-mono text-mono-label tracking-[0.12em] text-ork-text-muted uppercase">
                  {i === 0 ? "Antes" : "Después"}
                </p>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.ancho}
                  height={img.alto}
                  sizes="(max-width: 639px) 92vw, 36rem"
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
          <figcaption className="mx-auto mt-8 max-w-[60ch] text-center text-body text-ork-text-muted">
            {slide.pie}
          </figcaption>
        </figure>
      );

    case "cierre":
      return (
        <div className="text-center">
          <h2 className="mx-auto max-w-[20ch] font-display text-h1 font-bold text-balance text-ork-text">
            ¿Tienes un problema parecido?
          </h2>
          <p className="mx-auto mt-8 max-w-[52ch] text-body-lg text-ork-text-muted">
            Me cuentas cómo funciona hoy tu operación y te digo qué automatizaría primero — y qué
            no.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href={CAL_URL}>Agenda una llamada</Button>
          </div>
          <p className="mx-auto mt-16 max-w-[70ch] font-mono text-mono-label tracking-[0.12em] text-ork-text-muted uppercase">
            {slide.stack}
          </p>
        </div>
      );
  }
}
