/**
 * Tipos para el Lanyard de React Bits, que llega en JavaScript.
 *
 * Sin esto TypeScript deduce `null` de los valores por defecto de las props
 * y rechaza pasarle las rutas de las imágenes.
 */
declare module "@/components/Lanyard" {
  export interface LanyardProps {
    position?: [number, number, number];
    gravity?: [number, number, number];
    fov?: number;
    transparent?: boolean;
    /** Cara delantera de la tarjeta */
    frontImage?: string | null;
    /** Cara trasera de la tarjeta */
    backImage?: string | null;
    imageFit?: "cover" | "contain";
    lanyardImage?: string | null;
    lanyardWidth?: number;
    /** Multiplica el tamaño de la ficha sin mover la cámara. 1 = original */
    cardScale?: number;
  }
  const Lanyard: (props: LanyardProps) => JSX.Element;
  export default Lanyard;
}
