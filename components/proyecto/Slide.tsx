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
          <h1 className="mx-auto max-w-[17ch] font-display text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[1.02] font-bold tracking-[-0.03em] text-balance text-ork-text">
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
          <p className="mx-auto max-w-[19ch] font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] font-bold tracking-[-0.03em] text-balance text-ork-text">
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
          <p className="font-display text-[clamp(5rem,19vw,15rem)] leading-[0.9] font-bold tracking-[-0.04em] text-ork-cyan-hi">
            {slide.valor}
          </p>
          <p className="mx-auto mt-10 max-w-[26ch] text-balance text-[clamp(1.375rem,2.2vw,2rem)] leading-[1.3] text-ork-text">
            {slide.etiqueta}
          </p>
          {slide.nota ? (
            <p className="mx-auto mt-6 max-w-[46ch] font-mono text-mono-label tracking-[0.12em] text-ork-text-muted uppercase">
              {slide.nota}
            </p>
          ) : null}
        </div>
      );

    case "metricas":
      return (
        <div className="mx-auto w-full max-w-[68rem]">
          <dl className="grid grid-cols-2 gap-x-10 gap-y-14 sm:gap-x-16 lg:grid-cols-4">
            {slide.cifras.map((c) => (
              <div key={c.etiqueta} className="text-center">
                <dt className="sr-only">{c.etiqueta}</dt>
                <dd>
                  <p className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] font-bold tracking-[-0.03em] text-ork-cyan-hi">
                    {c.valor}
                  </p>
                  <p
                    aria-hidden="true"
                    className="mx-auto mt-5 max-w-[16ch] text-balance text-body-lg text-ork-text"
                  >
                    {c.etiqueta}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
          {slide.nota ? (
            <p className="mx-auto mt-16 max-w-[52ch] text-center text-body-lg text-ork-text-muted">
              {slide.nota}
            </p>
          ) : null}
        </div>
      );

    case "lista":
      return (
        <div className="mx-auto w-full max-w-[52rem]">
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-bold tracking-[-0.02em] text-balance text-ork-text">
            {slide.titulo}
          </h2>
          <ul className="mt-14 space-y-7">
            {slide.puntos.map((p, i) => (
              <li key={p.texto} className="flex items-start gap-5">
                <span
                  aria-hidden="true"
                  className="mt-1 font-mono text-mono-label tracking-[0.12em] text-ork-cyan"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[clamp(1.125rem,1.6vw,1.625rem)] leading-[1.45] text-ork-text">
                  {p.texto}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "diagrama":
      // El mapa manda: se le da todo el ancho de la diapositiva. Encajarlo en
      // 64rem obligaba a reducir el dibujo y con él la letra de los nodos.
      return (
        <div className="mx-auto w-full max-w-[1600px]">
          <h2 className="text-center font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-ork-text">
            {slide.titulo}
          </h2>
          <div className="mt-10">
            <FlowDiagram nodos={slide.nodos} aristas={slide.aristas} titulo={slide.titulo} />
          </div>
          {slide.pie ? (
            <p className="mx-auto mt-8 max-w-[60ch] text-center text-body-lg text-ork-text-muted">
              {slide.pie}
            </p>
          ) : null}
        </div>
      );

    case "imagen": {
      // Una captura de móvil es más alta que ancha: a ancho completo se sale
      // de la diapositiva. En ese caso manda el alto y el ancho se ajusta.
      const vertical = slide.imagen.alto > slide.imagen.ancho;
      return (
        <figure className="flex h-full w-full flex-col justify-center">
          <div
            className={
              // Ancho completo de la diapositiva: en 72rem la letra de dentro
              // de una captura de panel se quedaba en nada.
              "ork-marco relative mx-auto " + (vertical ? "w-fit" : "w-full")
            }
          >
            <Image
              src={slide.imagen.src}
              alt={slide.imagen.alt}
              width={slide.imagen.ancho}
              height={slide.imagen.alto}
              sizes={vertical ? "(max-width: 767px) 70vw, 30vh" : "(max-width: 767px) 92vw, 90vw"}
              className={vertical ? "max-h-[58vh] w-auto" : "h-auto w-full"}
            />
          </div>
          <figcaption className="mx-auto mt-8 max-w-[60ch] text-center text-body-lg text-ork-text-muted">
            {slide.pie}
          </figcaption>
        </figure>
      );
    }

    case "comparativa":
      return (
        <figure className="mx-auto w-full">
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
                  sizes="(max-width: 639px) 92vw, 45vw"
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
          <figcaption className="mx-auto mt-8 max-w-[60ch] text-center text-body-lg text-ork-text-muted">
            {slide.pie}
          </figcaption>
        </figure>
      );

    case "cierre":
      // Decisión de Aitor (2026-08-21): fuera «¿Tienes un problema parecido?» y
      // fuera la lista de herramientas de cada proyecto. El cierre es el mismo
      // en los dieciséis y no habla de stack, habla de criterio.
      return (
        <div className="text-center">
          <h2 className="mx-auto max-w-[24ch] font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.08] font-bold tracking-[-0.03em] text-balance text-ork-text">
            Soluciones hechas con experiencia.{" "}
            <span className="text-ork-text-muted">
              Pensadas para dar resultados desde el principio.
            </span>
          </h2>
          <p className="mx-auto mt-10 max-w-[52ch] text-body-lg text-ork-text-muted">
            Me cuentas cómo funciona hoy tu operación y te digo qué automatizaría primero — y qué
            no.
          </p>
          <div className="mt-12 flex justify-center">
            <Button href={CAL_URL}>Agenda una llamada</Button>
          </div>
        </div>
      );
  }
}
