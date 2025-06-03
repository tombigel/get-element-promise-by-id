import { getElementPromiseById } from '../src/index.js';

// State management
let currentController = null;
let multiControllers = [];

// DOM elements
const elementIdInput = document.getElementById('element-id');
const timeoutInput = document.getElementById('timeout');
const waitBtn = document.getElementById('wait-btn');
const abortBtn = document.getElementById('abort-btn');
const addElementBtn = document.getElementById('add-element-btn');
const clearBtn = document.getElementById('clear-btn');
const status = document.getElementById('status');
const dynamicContent = document.getElementById('dynamic-content');

const multiWaitBtn = document.getElementById('multi-wait-btn');
const addMultipleBtn = document.getElementById('add-multiple-btn');
const multiStatus = document.getElementById('multi-status');
const multiContent = document.getElementById('multi-content');

// Utility functions
function updateStatus(element, message, type = '') {
    element.className = `status ${type}`;
    element.textContent = message;
}

function setButtonsState(waiting) {
    waitBtn.disabled = waiting;
    abortBtn.disabled = !waiting;
}

function setMultiButtonsState(waiting) {
    multiWaitBtn.disabled = waiting;
}

// Basic demo functions
async function waitForElement() {
    const elementId = elementIdInput.value.trim();
    const timeout = parseInt(timeoutInput.value) || 0;

    if (!elementId) {
        updateStatus(status, 'Please enter an element ID', 'error');
        return;
    }

    currentController = new AbortController();
    setButtonsState(true);
    updateStatus(status, `Waiting for element with ID: "${elementId}"${timeout ? ` (timeout: ${timeout}ms)` : ''}...`, 'waiting');

    try {
        const options = { signal: currentController.signal };
        if (timeout > 0) {
            options.timeout = timeout;
        }

        const element = await getElementPromiseById(elementId, options);
        updateStatus(status, `✅ Element found! Tag: ${element.tagName.toLowerCase()}, ID: ${element.id}`, 'success');

        // Highlight the found element
        element.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            if (element.style) element.style.animation = '';
        }, 500);

    } catch (error) {
        if (error.name === 'AbortError') {
            updateStatus(status, '❌ Operation was aborted', 'error');
        } else if (error.name === 'TimeoutError') {
            updateStatus(status, '⏰ Timeout reached - element not found', 'error');
        } else {
            updateStatus(status, `❌ Error: ${error.message}`, 'error');
        }
    } finally {
        setButtonsState(false);
        currentController = null;
    }
}

function abortWait() {
    if (currentController) {
        currentController.abort();
    }
}

function addElement() {
    const elementId = elementIdInput.value.trim();
    if (!elementId) {
        updateStatus(status, 'Please enter an element ID first', 'error');
        return;
    }

    updateStatus(status, 'Adding element in 2 seconds...', 'waiting');

    setTimeout(() => {
        // Remove existing element if it exists
        const existing = document.getElementById(elementId);
        if (existing) {
            existing.remove();
        }

        // Create new element
        const element = document.createElement('div');
        element.id = elementId;
        element.className = 'element-placeholder';
        element.textContent = `Element: ${elementId}`;

        // Clear placeholder text and add element
        dynamicContent.innerHTML = '';
        dynamicContent.appendChild(element);

        updateStatus(status, `Element "${elementId}" has been added to the DOM!`, 'success');
    }, 2000);
}

function clearContent() {
    dynamicContent.innerHTML = 'Elements will appear here...';
    updateStatus(status, 'Content cleared', 'success');
}

// Multiple elements demo functions
async function waitForMultipleElements() {
    const elementIds = ['element-1', 'element-2', 'element-3'];
    multiControllers = [];
    setMultiButtonsState(true);

    updateStatus(multiStatus, 'Waiting for multiple elements: ' + elementIds.join(', '), 'waiting');

    const promises = elementIds.map(async (id) => {
        const controller = new AbortController();
        multiControllers.push(controller);

        try {
            const element = await getElementPromiseById(id, {
                signal: controller.signal,
                timeout: 10000
            });

            // Add success indicator
            element.style.border = '3px solid #28a745';
            element.style.animation = 'pulse 0.5s ease-in-out';

            return { success: true, id, element };
        } catch (error) {
            return { success: false, id, error: error.message };
        }
    });

    try {
        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
        const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success);

        updateStatus(multiStatus,
            `✅ ${successful.length} elements found, ${failed.length} failed/timeout`,
            successful.length > 0 ? 'success' : 'error'
        );
    } catch (error) {
        updateStatus(multiStatus, `❌ Error: ${error.message}`, 'error');
    } finally {
        setMultiButtonsState(false);
        multiControllers = [];
    }
}

function addMultipleElements() {
    const elementIds = ['element-1', 'element-2', 'element-3'];
    const colors = ['#74b9ff', '#fd79a8', '#fdcb6e'];

    multiContent.innerHTML = '';

    elementIds.forEach((id, index) => {
        setTimeout(() => {
            const element = document.createElement('div');
            element.id = id;
            element.className = 'element-placeholder';
            element.textContent = `Element ${index + 1}`;
            element.style.background = `linear-gradient(135deg, ${colors[index]}, ${colors[index]}dd)`;
            element.style.margin = '0.5rem';
            element.style.display = 'inline-block';

            multiContent.appendChild(element);

            if (index === elementIds.length - 1) {
                updateStatus(multiStatus, 'All elements have been added!', 'success');
            }
        }, (index + 1) * 1000); // Stagger the additions
    });

    updateStatus(multiStatus, 'Adding elements one by one...', 'waiting');
}

// Event listeners
waitBtn.addEventListener('click', waitForElement);
abortBtn.addEventListener('click', abortWait);
addElementBtn.addEventListener('click', addElement);
clearBtn.addEventListener('click', clearContent);

multiWaitBtn.addEventListener('click', waitForMultipleElements);
addMultipleBtn.addEventListener('click', addMultipleElements);

// Allow Enter key to trigger wait
elementIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !waitBtn.disabled) {
        waitForElement();
    }
});

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

console.log('🎉 get-element-promise-by-id demo loaded!');
console.log('Try the interactive examples above to see the library in action.');
