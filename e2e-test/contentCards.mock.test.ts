import { device, element, by, expect as detoxExpect, waitFor } from 'detox';
import {
  navigateToContentCards,
  selectViewType,
  switchTheme,
  switchTemplate,
  verifyInboxVisible,
  verifyEmptyStateVisible,
  takeScreenshot
} from './helpers';

describe.skip('Content Cards - Mock Data Tests', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await navigateToContentCards();
  });

  describe('Navigation', () => {
    it('should navigate to Content Cards View', async () => {
      await detoxExpect(element(by.id('view-picker-button'))).toBeVisible();
      await detoxExpect(element(by.text('Select View Type'))).toBeVisible();
    });

    it('should show default view as Remote', async () => {
      await detoxExpect(element(by.text('Remote'))).toBeVisible();
    });
  });

  describe('View Type Selection', () => {
    it('should open view picker modal', async () => {
      await element(by.id('view-picker-button')).tap();
      await waitFor(element(by.id('view-picker-modal')))
        .toBeVisible()
        .withTimeout(3000);
      
      // Verify all view options are present
      await detoxExpect(element(by.text('Remote'))).toBeVisible();
      await detoxExpect(element(by.text('Inbox'))).toBeVisible();
      await detoxExpect(element(by.text('Carousel'))).toBeVisible();
      await detoxExpect(element(by.text('Container with Styling'))).toBeVisible();
      await detoxExpect(element(by.text('Empty'))).toBeVisible();
      await detoxExpect(element(by.text('Custom Card View'))).toBeVisible();
      await detoxExpect(element(by.text('Templates'))).toBeVisible();
      
      // Close modal
      await element(by.id('modal-cancel-button')).tap();
    });
  });

    it('should switch to Templates view', async () => {
      await selectViewType('templates');
      await waitFor(element(by.id('content-cards-template-list')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('templates-view');
    });

  describe('Theme Switching', () => {
    it('should switch to Light theme', async () => {
      await switchTheme('light');
      await detoxExpect(element(by.id('theme-light'))).toBeVisible();
      await takeScreenshot('light-theme');
    });

    it('should switch to Dark theme', async () => {
      await switchTheme('dark');
      await detoxExpect(element(by.id('theme-dark'))).toBeVisible();
      await takeScreenshot('dark-theme');
    });

    it('should switch to System theme', async () => {
      await switchTheme('system');
      await detoxExpect(element(by.id('theme-system'))).toBeVisible();
      await takeScreenshot('system-theme');
    });

    it('should apply theme changes to Empty state', async () => {
      await selectViewType('empty');
      
      // Switch to light theme
      await switchTheme('light');
      await verifyEmptyStateVisible();
      await takeScreenshot('empty-state-light-theme');
      
      // Switch to dark theme
      await switchTheme('dark');
      await verifyEmptyStateVisible();
      await takeScreenshot('empty-state-dark-theme');
    });

    it('should apply theme changes to Container with Styling view', async () => {
      await selectViewType('container-with-styling');
      
      // Switch to light theme
      await switchTheme('light');
      await verifyInboxVisible('content-card-container-container-with-styling');
      await takeScreenshot('container-styling-light-theme');
      
      // Switch to dark theme
      await switchTheme('dark');
      await verifyInboxVisible('content-card-container-container-with-styling');
      await takeScreenshot('container-styling-dark-theme');
    });
  });

  describe('Template Switching', () => {
    beforeEach(async () => {
      // Navigate to Templates view first
      await selectViewType('templates');
      await waitFor(element(by.id('content-cards-template-list')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should display Small Image template by default', async () => {
      await detoxExpect(element(by.id('template-smallimage'))).toBeVisible();
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('small-image-template');
    });

    it('should switch to Large Image template', async () => {
      await switchTemplate('largeimage');
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('large-image-template');
    });

    it('should switch to Image Only template', async () => {
      await switchTemplate('imageonly');
      await waitFor(element(by.text('1. All fields')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('image-only-template');
    });

    it('should switch between all templates', async () => {
      // Small Image
      await switchTemplate('smallimage');
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Large Image
      await switchTemplate('largeimage');
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Image Only
      await switchTemplate('imageonly');
      await waitFor(element(by.text('1. All fields')))
        .toBeVisible()
        .withTimeout(5000);
      
      await takeScreenshot('all-templates-cycled');
    });
  });

  describe('Content Card Rendering - Mock Data', () => {
    it('should render Inbox cards with mock data', async () => {
      await selectViewType('inbox');
      await verifyInboxVisible('content-card-container-inbox');
      
      // Verify heading is visible
      await waitFor(element(by.text('Inbox')))
        .toBeVisible()
        .withTimeout(5000);
      
      await takeScreenshot('inbox-mock-rendering');
    });

    it('should render Carousel cards with mock data', async () => {
      await selectViewType('carousel');
      await verifyInboxVisible('content-card-container-carousel');
      
      // Verify heading is visible
      await waitFor(element(by.text('Carousel')))
        .toBeVisible()
        .withTimeout(5000);
      
      await takeScreenshot('carousel-mock-rendering');
    });

    it('should render Custom Card View with custom styling', async () => {
      await selectViewType('custom-card-view');
      await verifyInboxVisible('content-card-container-custom-card-view');
      
      // Verify heading is visible
      await waitFor(element(by.text('Custom Card View')))
        .toBeVisible()
        .withTimeout(5000);
      
      await takeScreenshot('custom-card-view-rendering');
    });

    it('should render Container with Styling with custom container styles', async () => {
      await selectViewType('container-with-styling');
      await verifyInboxVisible('content-card-container-container-with-styling');
      
      // Verify heading is visible
      await waitFor(element(by.text('Container with Styling')))
        .toBeVisible()
        .withTimeout(5000);
      
      await takeScreenshot('container-styling-rendering');
    });

    it('should render Empty state correctly', async () => {
      await selectViewType('empty');
      await verifyEmptyStateVisible();
      
      // Verify empty state message
      await detoxExpect(element(by.text('No deals today come back soon!'))).toBeVisible();
      
      await takeScreenshot('empty-state-rendering');
    });
  });

  describe('Template Content Rendering', () => {
    beforeEach(async () => {
      await selectViewType('templates');
      await waitFor(element(by.id('content-cards-template-list')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should render all Small Image template variations', async () => {
      await switchTemplate('smallimage');
      
      // Verify first card is visible
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Verify other template variations exist in the list
      await waitFor(element(by.text('[dark/light]Custom theme')))
        .toBeVisible()
        .withTimeout(5000);
      
      await takeScreenshot('small-image-variations');
    });

    it('should render all Large Image template variations', async () => {
      await switchTemplate('largeimage');
      
      // Verify first card is visible
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Verify other variations
      await waitFor(element(by.text('[button] 3')))
        .toBeVisible()
        .withTimeout(5000);
      
      await takeScreenshot('large-image-variations');
    });

    it('should render all Image Only template variations', async () => {
      await switchTemplate('imageonly');
      
      // Verify first card is visible
      await waitFor(element(by.text('1. All fields')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Verify other variations
      await waitFor(element(by.text('2.Adobe default image, dismiss style circle')))
        .toBeVisible()
        .withTimeout(5000);
      
      await takeScreenshot('image-only-variations');
    });

    it('should scroll through template list', async () => {
      await switchTemplate('smallimage');
      
      // Scroll down to see more cards
      await element(by.id('content-cards-template-list')).scrollTo('bottom');
      
      // Wait a bit for scroll to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await takeScreenshot('scrolled-template-list');
    });
  });

  describe('Theme and Template Combinations', () => {
    beforeEach(async () => {
      await selectViewType('templates');
      await waitFor(element(by.id('content-cards-template-list')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should apply light theme to Small Image templates', async () => {
      await switchTheme('light');
      await switchTemplate('smallimage');
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('small-image-light');
    });

    it('should apply dark theme to Small Image templates', async () => {
      await switchTheme('dark');
      await switchTemplate('smallimage');
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('small-image-dark');
    });

    it('should apply light theme to Large Image templates', async () => {
      await switchTheme('light');
      await switchTemplate('largeimage');
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('large-image-light');
    });

    it('should apply dark theme to Large Image templates', async () => {
      await switchTheme('dark');
      await switchTemplate('largeimage');
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('large-image-dark');
    });

    it('should apply light theme to Image Only templates', async () => {
      await switchTheme('light');
      await switchTemplate('imageonly');
      await waitFor(element(by.text('1. All fields')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('image-only-light');
    });

    it('should apply dark theme to Image Only templates', async () => {
      await switchTheme('dark');
      await switchTemplate('imageonly');
      await waitFor(element(by.text('1. All fields')))
        .toBeVisible()
        .withTimeout(5000);
      await takeScreenshot('image-only-dark');
    });
  });

  describe('View Persistence', () => {
    it('should maintain selected view after theme change', async () => {
      // Select Inbox view
      await selectViewType('inbox');
      await verifyInboxVisible('content-card-container-inbox');
      
      // Switch theme
      await switchTheme('dark');
      
      // Verify still on Inbox view
      await verifyInboxVisible('content-card-container-inbox');
      await detoxExpect(element(by.text('Inbox'))).toBeVisible();
    });

    it('should maintain selected template after theme change', async () => {
      // Select Templates view and Large Image template
      await selectViewType('templates');
      await switchTemplate('largeimage');
      
      // Verify Large Image template
      await waitFor(element(by.text('[Basic] all fields')))
        .toBeVisible()
        .withTimeout(5000);
      
      // Switch theme
      await switchTheme('dark');
      
      // Verify still on Large Image template
      await detoxExpect(element(by.id('template-largeimage'))).toBeVisible();
    });
  });

});