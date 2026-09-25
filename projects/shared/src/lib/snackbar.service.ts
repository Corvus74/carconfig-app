import { Service } from '@angular/core';

@Service()
export class SnackbarService {
  /**
   * Shows a simple snackbar toast message. This is intentionally minimal
   * to avoid adding UI library dependencies.
   */
  show(message: string, duration = 3000): void {
    if (typeof document === 'undefined') return;

    const el = document.createElement('div');
    el.textContent = message;
    el.className = 'cc-snackbar';

    Object.assign(el.style, {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#323232',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '6px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
      zIndex: '10000',
      opacity: '0',
      transition: 'opacity 200ms ease-in-out',
      pointerEvents: 'auto',
    } as Partial<CSSStyleDeclaration>);

    document.body.appendChild(el);
    // trigger animation
    requestAnimationFrame(() => (el.style.opacity = '1'));

    const hide = () => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 220);
    };

    setTimeout(hide, duration);
  }
}
