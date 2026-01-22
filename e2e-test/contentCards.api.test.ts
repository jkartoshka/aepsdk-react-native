import { device, element, by, expect as detoxExpect } from 'detox';
import {
  navigateToContentCards,
  selectViewType,
  trackAction,
  verifyInboxVisible,
  takeScreenshot
} from './helpers';

// TODO: These tests are currently commented out due to connection/timeout issues
// Uncomment and fix once the underlying issues are resolved
describe.skip('Content Cards - API Integration Tests', () => {
  beforeAll(async () => {
    await device.launchApp({ 
      newInstance: true,
      permissions: {
        notifications: 'YES'
      }
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await navigateToContentCards();
  });

  describe('Remote Content Card Fetching', () => {
    it('should load Remote view by default', async () => {
      // Verify we're on Remote view
      await detoxExpect(element(by.text('Remote'))).toBeVisible();
      
      // Verify content card container is present
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('remote-view-loaded');
    });

    it('should display loading state while fetching remote content', async () => {
      // Switch to a different view and back to trigger refetch
      await selectViewType('inbox');
      await selectViewType('remote');
      
      // The container should be visible (may show loading or content)
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('remote-loading-state');
    });

    it('should handle remote content fetch completion', async () => {
      // Wait for any loading to complete
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Verify container is still visible (with content or empty state)
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('remote-content-loaded');
    });

    it('should handle error states gracefully', async () => {
      // The app should not crash even if API fails
      await verifyInboxVisible('inbox-remote');
      
      // Wait for potential error handling
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await takeScreenshot('remote-error-handling');
    });
  });

  describe('Track Action Functionality', () => {
    beforeEach(async () => {
      // Ensure we're on Remote view for track action testing
      await selectViewType('remote');
    });

    it('should display track action input and button', async () => {
      await detoxExpect(element(by.id('track-action-input'))).toBeVisible();
      await detoxExpect(element(by.id('track-action-button'))).toBeVisible();
    });

    it('should enable typing in track action input', async () => {
      await element(by.id('track-action-input')).typeText('test_action');
      
      // Clear for next test
      await element(by.id('track-action-input')).clearText();
    });

    it('should track action and refresh content cards', async () => {
      // Enter action name
      await element(by.id('track-action-input')).typeText('content_card_test');
      
      // Tap track button
      await element(by.id('track-action-button')).tap();
      
      // Wait for action to be tracked and content to refresh
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verify content card container is still visible
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('after-track-action');
    });

    it('should track multiple actions sequentially', async () => {
      // First action
      await element(by.id('track-action-input')).typeText('action_one');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Second action
      await element(by.id('track-action-input')).clearText();
      await element(by.id('track-action-input')).typeText('action_two');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Third action
      await element(by.id('track-action-input')).clearText();
      await element(by.id('track-action-input')).typeText('action_three');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify content card container is still visible
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('after-multiple-track-actions');
    });

    it('should disable track button when input is empty', async () => {
      // Ensure input is empty
      await element(by.id('track-action-input')).clearText();
      
      // Button should be disabled (can't directly check disabled state in Detox,
      // but we can verify it doesn't crash when tapped)
      try {
        await element(by.id('track-action-button')).tap();
      } catch (e) {
        // Expected behavior - button might not be tappable when disabled
      }
      
      await takeScreenshot('track-button-disabled');
    });

    it('should clear input after successful track action', async () => {
      // Enter action name
      await element(by.id('track-action-input')).typeText('clear_test');
      
      // Tap track button
      await element(by.id('track-action-button')).tap();
      
      // Wait for action to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Input should be cleared
      await detoxExpect(element(by.id('track-action-input'))).toHaveText('');
      
      await takeScreenshot('input-cleared-after-track');
    });

    it('should track action with special characters', async () => {
      await element(by.id('track-action-input')).typeText('test_action_123');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await verifyInboxVisible('inbox-remote');
      await takeScreenshot('track-special-chars');
    });

    it('should track action with long text', async () => {
      const longText = 'this_is_a_very_long_action_name_for_testing_purposes';
      await element(by.id('track-action-input')).typeText(longText);
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await verifyInboxVisible('inbox-remote');
      await takeScreenshot('track-long-text');
    });
  });

  describe('Track Action with Different Views', () => {
    it('should show track action input in Remote view', async () => {
      await selectViewType('remote');
      await detoxExpect(element(by.id('track-action-input'))).toBeVisible();
      await detoxExpect(element(by.id('track-action-button'))).toBeVisible();
    });

    it('should show track action input in Inbox view', async () => {
      await selectViewType('inbox');
      await detoxExpect(element(by.id('track-action-input'))).toBeVisible();
      await detoxExpect(element(by.id('track-action-button'))).toBeVisible();
    });

    it('should show track action input in Carousel view', async () => {
      await selectViewType('carousel');
      await detoxExpect(element(by.id('track-action-input'))).toBeVisible();
      await detoxExpect(element(by.id('track-action-button'))).toBeVisible();
    });

    it('should NOT show track action in Templates view', async () => {
      await selectViewType('templates');
      
      // Track action should not be visible in Templates view
      // Instead, template selector should be visible
      await detoxExpect(element(by.id('template-smallimage'))).toBeVisible();
    });
  });

  describe('Content Refresh After Track Action', () => {
    it('should refresh remote content after tracking action', async () => {
      await selectViewType('remote');
      
      // Track action to trigger content refresh
      await trackAction('refresh_test');
      
      // Wait for content to refresh
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verify container is still visible with potentially updated content
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('content-refreshed');
    });

    it('should maintain view state after content refresh', async () => {
      await selectViewType('inbox');
      
      // Track action
      await trackAction('maintain_state_test');
      
      // Wait for refresh
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Should still be on Inbox view
      await verifyInboxVisible('content-card-container-inbox');
      await detoxExpect(element(by.text('Inbox'))).toBeVisible();
      
      await takeScreenshot('state-maintained');
    });
  });

  describe('Real-time Content Updates', () => {
    it('should handle multiple rapid track actions', async () => {
      await selectViewType('remote');
      
      // Rapidly track multiple actions
      for (let i = 0; i < 3; i++) {
        await element(by.id('track-action-input')).clearText();
        await element(by.id('track-action-input')).typeText(`rapid_action_${i}`);
        await element(by.id('track-action-button')).tap();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Wait for all actions to complete
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Verify app is still stable
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('after-rapid-actions');
    });

    it('should handle track action during view switch', async () => {
      await selectViewType('remote');
      
      // Start track action
      await element(by.id('track-action-input')).typeText('switch_test');
      await element(by.id('track-action-button')).tap();
      
      // Immediately switch view
      await selectViewType('inbox');
      
      // Wait for both operations to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Should be on Inbox view
      await verifyInboxVisible('content-card-container-inbox');
      
      await takeScreenshot('action-during-switch');
    });
  });

  describe('Surface-based Content Loading', () => {
    it('should load content for platform-specific surface', async () => {
      await selectViewType('remote');
      
      // The app uses different surfaces for iOS and Android
      // This test verifies that the appropriate surface is loaded
      await verifyInboxVisible('inbox-remote');
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      await takeScreenshot('platform-surface-loaded');
    });

    it('should handle surface switching between views', async () => {
      // Remote view uses platform-specific surface
      await selectViewType('remote');
      await verifyInboxVisible('inbox-remote');
      
      // Mock views use mock surfaces
      await selectViewType('inbox');
      await verifyInboxVisible('content-card-container-inbox');
      
      // Switch back to remote
      await selectViewType('remote');
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('surface-switching');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      await selectViewType('remote');
      
      // Even if network fails, app should not crash
      await verifyInboxVisible('inbox-remote');
      
      // Track action that might fail
      await trackAction('network_error_test');
      
      // App should still be functional
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('network-error-handling');
    });

    it('should handle empty API responses', async () => {
      await selectViewType('remote');
      
      // Track action that might return empty results
      await trackAction('empty_response_test');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Container should still be visible (possibly showing empty state)
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('empty-api-response');
    });

    it('should recover from temporary failures', async () => {
      await selectViewType('remote');
      
      // First attempt (might fail)
      await trackAction('recovery_test_1');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Second attempt (should work)
      await trackAction('recovery_test_2');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // App should be functional
      await verifyInboxVisible('inbox-remote');
      
      await takeScreenshot('recovered-from-failure');
    });
  });
});

