/* =============================================
   Modal.jsx — Componente de ventana modal
   Overlay con blur, animación desde abajo
   ============================================= */

import { useEffect } from 'react';
import './Modal.css';

/**
 * Modal — Ventana modal con overlay y blur
 * @param {string} titulo - Título del modal
 * @param {function} onClose - Función para cerrar el modal
 * @param {React.ReactNode} children - Contenido interno
 * @param {string} size - 'sm' | 'md' | 'lg' (por defecto 'md')
 */
export default function Modal({ titulo, onClose, children, size = 'md' }) {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const manejarTecla = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', manejarTecla);
    return () => document.removeEventListener('keydown', manejarTecla);
  }, [onClose]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Evitar que el clic dentro del modal lo cierre */}
      <div
        className={`modal-panel modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="modal-header">
          <h3 className="modal-titulo">{titulo}</h3>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
