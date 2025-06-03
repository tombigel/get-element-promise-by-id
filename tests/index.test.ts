import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getElementPromiseById } from '../src/index';

describe('getElementPromiseById', () => {
  let testElement: HTMLElement | null = null;

  beforeEach(() => {
    // Reset JSDOM before each test
    document.body.innerHTML = '';
    testElement = null;
  });

  afterEach(() => {
    if (testElement && testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
  });

  it('should resolve with the element when it is added to the DOM', async () => {
    const elementId = 'test-element';
    const promise = getElementPromiseById(elementId);

    // Add the element to the DOM after a short delay
    setTimeout(() => {
      testElement = document.createElement('div');
      testElement.id = elementId;
      document.body.appendChild(testElement);
    }, 50);

    const element = await promise;
    expect(element).toBeDefined();
    expect(element.id).toBe(elementId);
  });

  it('should reject with a TimeoutError if the element is not found within the timeout', async () => {
    const elementId = 'non-existent-element';
    const timeout = 100;
    let caughtError: DOMException | null = null;

    try {
      await getElementPromiseById(elementId, { timeout });
    } catch (error) {
      caughtError = error as DOMException;
    }
    expect(caughtError).toBeInstanceOf(DOMException);
    expect(caughtError?.name).toBe('TimeoutError');
  });

  it('should reject with an AbortError if the signal is aborted', async () => {
    const elementId = 'abort-test-element';
    const controller = new AbortController();
    const signal = controller.signal;
    let caughtError: DOMException | null = null;

    const promise = getElementPromiseById(elementId, { signal });

    // Abort the operation after a short delay
    setTimeout(() => {
      controller.abort();
    }, 50);

    try {
      await promise;
    } catch (error) {
      caughtError = error as DOMException;
    }
    expect(caughtError).toBeInstanceOf(DOMException);
    expect(caughtError?.name).toBe('AbortError');
  });

  it('should resolve immediately if the element already exists in the DOM', async () => {
    const elementId = 'pre-existing-element';
    testElement = document.createElement('div');
    testElement.id = elementId;
    document.body.appendChild(testElement);

    const element = await getElementPromiseById(elementId);
    expect(element).toBeDefined();
    expect(element.id).toBe(elementId);
  });

 it('should reject immediately if the signal is already aborted', async () => {
    const elementId = 'already-aborted-element';
    const controller = new AbortController();
    controller.abort(); // Abort immediately
    const signal = controller.signal;
    let caughtError: DOMException | null = null;

    try {
      await getElementPromiseById(elementId, { signal });
    } catch (error) {
      caughtError = error as DOMException;
    }
    expect(caughtError).toBeInstanceOf(DOMException);
    expect(caughtError?.name).toBe('AbortError');
  });
});
