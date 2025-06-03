/**
 * Wait for an element with the specified ID to appear in the DOM.
 *
 * @author Tom Bigelajzen <getelementpromise@tombigel.com>
 * @param {string} id - The ID of the element to wait for
 * @param {Object} options - Configuration options
 * @param {number} [options.timeout=0] - Timeout in milliseconds (0 = no timeout)
 * @param {AbortSignal} [options.signal] - AbortSignal to cancel the operation
 * @returns {Promise<HTMLElement>} Promise that resolves with the found element
 *
 * @throws {DOMException} AbortError - When the operation is aborted
 * @throws {DOMException} TimeoutError - When the timeout is reached
 *
 * @example
 * // Basic usage
 * const element = await getElementPromiseById('my-element');
 *
 * @example
 * // With timeout
 * const element = await getElementPromiseById('my-element', { timeout: 5000 });
 *
 * @example
 * // With abort signal
 * const controller = new AbortController();
 * const element = await getElementPromiseById('my-element', { signal: controller.signal });
 * // Later: controller.abort();
 */
export function getElementPromiseById(
  id: string,
  { timeout = 0, signal }: { timeout?: number; signal?: AbortSignal } = {},
): Promise<HTMLElement> {
  let timer: ReturnType<typeof setTimeout>;
  const el: HTMLElement | null = document.getElementById(id);
  const config = { attributes: false, childList: true, subtree: true };

  const callback = (
    resolve: (value: HTMLElement) => void,
    mutationList: MutationRecord[],
    observer: MutationObserver,
  ) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        for (const added of mutation.addedNodes) {
          if ((added as HTMLElement).id === id) {
            clearTimeout(timer);
            observer.disconnect();
            resolve(added as HTMLElement);
          }
        }
      }
    }
  };

  // If passed an aborted AbortSignal, abort immediately
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }

  // If the element exists, resolve immediately
  if (el) {
    return Promise.resolve(el);
  }

  return new Promise<HTMLElement>((resolve, reject) => {
    const observer = new MutationObserver(callback.bind(null, resolve));
    observer.observe(document.body, config);

    if (timeout) {
      timer = setTimeout(() => {
        observer.disconnect();
        reject(new DOMException('Timeout', 'TimeoutError'));
      }, timeout);
    }

    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      observer.disconnect();
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}
