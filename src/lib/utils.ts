/**
 * Safely copies text to the clipboard.
 * Supports modern navigator.clipboard API in secure contexts (HTTPS/localhost)
 * and falls back to document.execCommand('copy') in non-secure/HTTP or sandboxed iframe environments.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers / non-secure contexts / sandboxed iframes
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling or visual shifts
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Defensive clipboard copy failed:', err);
    return false;
  }
};
