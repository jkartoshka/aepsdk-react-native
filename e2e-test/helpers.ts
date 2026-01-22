import { device, element, by, waitFor } from 'detox';

/**
 * Helper function to navigate to ContentCardsView
 */
export async function navigateToContentCards() {
  await waitFor(element(by.id('content-cards-nav-button')))
    .toBeVisible()
    .withTimeout(5000);
  await element(by.id('content-cards-nav-button')).tap();
  
  // Wait for the view to load
  await waitFor(element(by.id('view-picker-button')))
    .toBeVisible()
    .withTimeout(5000);
}

/**
 * Helper function to select a view type from the modal picker
 */
export async function selectViewType(viewType: 'remote' | 'inbox' | 'carousel' | 'container-with-styling' | 'empty' | 'custom-card-view' | 'templates') {
  // Open the view picker modal
  await element(by.id('view-picker-button')).tap();
  
  // Wait for modal to appear
  await waitFor(element(by.id('view-picker-modal')))
    .toBeVisible()
    .withTimeout(3000);
  
  // Select the view option
  await element(by.id(`view-option-${viewType}`)).tap();
  
  // Wait for modal to close
  await waitFor(element(by.id('view-picker-modal')))
    .not.toBeVisible()
    .withTimeout(3000);
}

/**
 * Helper function to switch theme
 */
export async function switchTheme(theme: 'light' | 'dark' | 'system') {
  await waitFor(element(by.id(`theme-${theme}`)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.id(`theme-${theme}`)).tap();
  
  // Wait a bit for theme to apply
  await new Promise(resolve => setTimeout(resolve, 500));
}

/**
 * Helper function to switch template (only works when Templates view is selected)
 */
export async function switchTemplate(template: 'smallimage' | 'largeimage' | 'imageonly') {
  await waitFor(element(by.id(`template-${template}`)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.id(`template-${template}`)).tap();
  
  // Wait for template to load
  await new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * Helper function to track an action
 */
export async function trackAction(actionName: string) {
  // Enter action name
  await waitFor(element(by.id('track-action-input')))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.id('track-action-input')).typeText(actionName);
  
  // Tap track button
  await element(by.id('track-action-button')).tap();
  
  // Wait for action to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
}

/**
 * Helper function to verify content card inbox is visible
 */
export async function verifyInboxVisible(inboxTestId?: string, timeout: number = 10000) {
  const testId = inboxTestId || 'content-cards-inbox';
  await waitFor(element(by.id(testId)))
    .toExist()
    .withTimeout(timeout);
}

/**
 * Helper function to verify empty state is visible
 */
export async function verifyEmptyStateVisible() {
  await waitFor(element(by.id('content-card-empty-state')))
    .toBeVisible()
    .withTimeout(5000);
}

/**
 * Helper function to scroll to element
 */
export async function scrollToElement(elementId: string, scrollViewId: string = 'content-cards-template-list') {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(200, 'down');
}

/**
 * Helper function to wait for loading to complete
 */
export async function waitForLoadingComplete(timeout: number = 10000) {
  // Wait a bit for any loading states to complete
  await new Promise(resolve => setTimeout(resolve, timeout));
}

/**
 * Helper function to take a screenshot
 */
export async function takeScreenshot(name: string) {
  await device.takeScreenshot(name);
}

/**
 * Helper function to reload React Native
 * This fully resets the app state
 */
export async function resetApp() {
  await device.reloadReactNative();
  await new Promise(resolve => setTimeout(resolve, 2000));
  await navigateToContentCards();
}
