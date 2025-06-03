# get-element-promise-by-id

An implementation of `getElementById` that returns a promise and waits for the element to be added to the DOM if it's not already present. Supports timeouts and AbortController signals for flexible async DOM element handling.

[![npm version](https://badge.fury.io/js/get-element-promise-by-id.svg)](https://www.npmjs.com/package/get-element-promise-by-id)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Promise-based**: Clean async/await syntax
- **Timeout support**: Set custom timeouts or wait indefinitely
- **Abortable**: Cancel operations using AbortController
- **MutationObserver**: Efficiently watches for DOM changes
- **TypeScript**: Full TypeScript support with type definitions
- **Lightweight**: Minimal dependencies and small bundle size

## Installation

```bash
npm install get-element-promise-by-id
```

## Usage

### Basic Usage

```javascript
import { getElementPromiseById } from 'get-element-promise-by-id';

// Wait for an element to appear
const element = await getElementPromiseById('my-element');
console.log('Element found:', element);
```

### With Timeout

```javascript
// Wait up to 5 seconds for the element
try {
  const element = await getElementPromiseById('my-element', { timeout: 5000 });
  console.log('Element found:', element);
} catch (error) {
  if (error.name === 'TimeoutError') {
    console.log('Element not found within timeout');
  }
}
```

### With AbortController

```javascript
const controller = new AbortController();

// Start waiting for element
const promise = getElementPromiseById('my-element', { 
  signal: controller.signal 
});

// Cancel after 3 seconds
setTimeout(() => controller.abort(), 3000);

try {
  const element = await promise;
  console.log('Element found:', element);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Operation was cancelled');
  }
}
```

## API

### `getElementPromiseById(id, options?)`

Returns a promise that resolves when an element with the specified ID is found in the DOM.

#### Parameters

- `id` (string): The ID of the element to wait for
- `options` (object, optional):
  - `timeout` (number, default: 0): Timeout in milliseconds. Set to 0 for no timeout
  - `signal` (AbortSignal): AbortSignal to cancel the operation

#### Returns

- `Promise<HTMLElement>`: Promise that resolves with the found element

#### Throws

- `DOMException` with name `'TimeoutError'`: When the timeout is reached
- `DOMException` with name `'AbortError'`: When the operation is aborted

## Demo

Try the interactive demo at: [https://tombigel.github.io/get-element-promise-by-id/](https://tombigel.github.io/get-element-promise-by-id/)

Or run it locally:

```bash
git clone https://github.com/tombigel/get-element-promise-by-id.git
cd get-element-promise-by-id
npm install
npm run dev
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run coverage

# Build library
npm run build:lib

# Build demo
npm run build:demo

# Start development server
npm run dev
```

## Browser Support

This library uses modern JavaScript features including:

- MutationObserver
- AbortController
- Promises

Supported in all modern browsers. For older browser support, ensure these APIs are polyfilled.

## License

MIT © [Tom Bigelajzen](https://github.com/tombigel)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

**Tom Bigelajzen**

- Email: <getelementpromise@tombigel.com>
- GitHub: [@tombigel](https://github.com/tombigel)
- Website: [tombigel.com](https://tombigel.com)
