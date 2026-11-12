import { useEffect } from 'react'

// Closes a popup when the user presses outside `containerRef` or hits Escape
function useDismiss(containerRef, open, onDismiss) {
  useEffect(() => {
    if (!open) return

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) onDismiss()
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') onDismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef, open, onDismiss])
}

export default useDismiss
