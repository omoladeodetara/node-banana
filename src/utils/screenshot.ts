import { toPng } from 'html-to-image';

/**
 * Captures a screenshot of the workflow canvas
 * @param elementSelector - CSS selector for the element to capture
 * @param filename - Name for the downloaded file
 * @returns Promise that resolves when screenshot is complete
 */
export async function captureScreenshot(
  elementSelector: string = '.react-flow',
  filename?: string
): Promise<void> {
  const element = document.querySelector(elementSelector) as HTMLElement;
  
  if (!element) {
    throw new Error('Canvas element not found');
  }

  const actualFilename = filename || generateScreenshotFilename();

  try {
    // Capture the element using html-to-image
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2, // Higher quality for retina displays
      backgroundColor: '#fafaf9',
    });
    
    // Download the image
    downloadImage(dataUrl, actualFilename);
  } catch (error) {
    console.error('Screenshot failed:', error);
    throw error;
  }
}

/**
 * Downloads an image from a URL
 */
function downloadImage(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates a timestamp-based filename
 */
export function generateScreenshotFilename(prefix: string = 'workflow'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.png`;
}
