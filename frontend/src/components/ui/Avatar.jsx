/**
 * Avatar.jsx — Avatar circular con iniciales para CorpHR.
 *
 * Props:
 *   iniciales  string — 1-2 letras a mostrar
 *   size       'xs'|'sm'|'md'|'lg'|'xl'
 *   gradiente  string — clase CSS para el gradiente de fondo
 */
import './Avatar.css';

/* Gradientes predefinidos para asignar a usuarios */
const GRADIENTES = [
  'linear-gradient(135deg,#4361EE,#7B5CF6)',
  'linear-gradient(135deg,#06D6A0,#059669)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#38BDF8,#4361EE)',
  'linear-gradient(135deg,#8B5CF6,#F43F5E)',
];

/**
 * Selecciona un gradiente determinista basado en las iniciales.
 * Esto garantiza que el mismo usuario siempre tenga el mismo color.
 */
function obtenerGradiente(iniciales) {
  const codigo = (iniciales || 'U').charCodeAt(0);
  return GRADIENTES[codigo % GRADIENTES.length];
}

export default function Avatar({ iniciales = '?', size = 'md' }) {
  /* Color de fondo basado en las iniciales del usuario */
  const gradient = obtenerGradiente(iniciales);

  return (
    <span
      className={`avatar avatar--${size}`}
      style={{ background: gradient }}
      aria-label={`Avatar de ${iniciales}`}
    >
      {initials(iniciales)}
    </span>
  );
}

/* Asegurar que se muestran maximo 2 letras */
function initials(str) {
  return (str || '?').slice(0, 2).toUpperCase();
}