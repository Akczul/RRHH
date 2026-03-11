/* =============================================
   Button.jsx — Componente botón reutilizable
   Variantes: primary, secondary, danger
   Tamaños: normal, small (btn-sm)
   ============================================= */

import './Button.css';

/**
 * Button — Botón con variantes de estilo
 * @param {string} variante - 'primary' | 'secondary' | 'danger'
 * @param {boolean} small - Tamaño reducido
 * @param {string} type - Tipo HTML del botón
 * @param {function} onClick - Manejador de clic
 * @param {React.ReactNode} children - Contenido del botón
 * @param {boolean} disabled - Deshabilitar botón
 */
export default function Button({
  variante = 'primary',
  small = false,
  type = 'button',
  onClick,
  children,
  disabled = false,
  fullWidth = false,
  className = '',
}) {
  const clases = [
    'btn',
    `btn-${variante}`,
    small ? 'btn-sm' : '',
    fullWidth ? 'btn-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={clases}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
