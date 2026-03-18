/**
 * Button.jsx — Componente de boton reutilizable de CorpHR.
 *
 * Props:
 *   variante   'primary' | 'secondary' | 'danger' | 'ghost'
 *   size       'md' (default) | 'sm' | 'lg'
 *   cargando   boolean — muestra spinner y deshabilita el boton
 *   fullWidth  boolean — ocupa el 100% del ancho del padre
 *   icono      ReactNode — icono SVG opcional al principio
 *   + todos los atributos nativos de <button>
 */
import './Button.css';

export default function Button({
  children,
  variante  = 'primary',
  size      = 'md',
  cargando  = false,
  fullWidth = false,
  icono     = null,
  className = '',
  disabled,
  ...rest
}) {
  /* Construir la lista de clases segun los props */
  const clases = [
    'btn',
    `btn--${variante}`,
    `btn--${size}`,
    fullWidth && 'btn--full',
    (cargando || disabled) && 'btn--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={clases}
      disabled={cargando || disabled}
      {...rest}
    >
      {/* Spinner de carga — solo visible cuando cargando=true */}
      {cargando ? (
        <span className="spinner" aria-hidden="true" />
      ) : (
        /* Icono opcional al inicio del texto */
        icono && <span className="btn__icon">{icono}</span>
      )}

      {/* Texto o contenido del boton */}
      <span>{children}</span>
    </button>
  );
}