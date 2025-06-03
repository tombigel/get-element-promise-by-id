# get-element-promise-by-id Demo

This is an interactive demo showcasing the `get-element-promise-by-id` library functionality.

## Features Demonstrated

- **Basic Usage**: Wait for elements with configurable timeouts
- **Abort Signal**: Cancel operations using AbortController
- **Multiple Elements**: Wait for multiple elements concurrently
- **Visual Feedback**: Real-time status updates and element highlighting

## Running the Demo

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build:demo
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## Demo Sections

1. **Basic Usage**: Enter an element ID and timeout, then test waiting for elements
2. **Dynamic Content Area**: Visual area where test elements appear
3. **Multiple Elements Demo**: Test waiting for multiple elements simultaneously

## Interactive Examples

- Use "Wait for Element" to start waiting for a DOM element
- Use "Add Element (after 2s)" to simulate delayed element creation
- Use "Abort" to cancel waiting operations
- Test different timeout values (0 = no timeout)
- Try the multiple elements demo for concurrent operations 
