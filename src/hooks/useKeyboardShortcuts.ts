import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onToggleEdit?: () => void;
  onOpenCatalog?: () => void;
  onOpenShortcuts?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onToggleEdit,
  onOpenCatalog,
  onOpenShortcuts,
  onEscape,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModKey = e.ctrlKey || e.metaKey;

      // Cmd/Ctrl + E: Toggle edit mode
      if (isModKey && e.key === 'e' && onToggleEdit) {
        e.preventDefault();
        onToggleEdit();
        return;
      }

      // Cmd/Ctrl + K: Open widget catalog
      if (isModKey && e.key === 'k' && onOpenCatalog) {
        e.preventDefault();
        onOpenCatalog();
        return;
      }

      // Cmd/Ctrl + /: Open keyboard shortcuts modal
      if (isModKey && e.key === '/' && onOpenShortcuts) {
        e.preventDefault();
        onOpenShortcuts();
        return;
      }

      // Escape: Close modals/drawers/edit mode
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleEdit, onOpenCatalog, onOpenShortcuts, onEscape]);
}
