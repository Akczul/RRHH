/**
 * Badge.jsx — Etiqueta de estado tipo pill para CorpHR.
 *
 * Props:
 *   texto  string — texto a mostrar
 *   tipo   'green'|'blue'|'orange'|'red'|'purple'|'gray'
 *   dot    boolean — mostrar punto de estado al inicio
 */
import './Badge.css';

export default function Badge({ texto, tipo = 'gray', dot = false }) {
  return (
    /* La clase dinamica determina el color del badge */
    <span className={`badge badge--${tipo}`}>
      {/* Punto opcional de estado */}
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {texto}
    </span>
  );
}