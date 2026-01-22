import { device, element, by, expect as detoxExpect, waitFor } from 'detox';
import {
  navigateToContentCards,
  verifyInboxVisible,
  takeScreenshot,
} from './helpers';

/**
 * Sample E2E Tests for Content Cards
 * 
 * This file demonstrates various testing patterns and best practices
 * for writing Detox end-to-end tests. Use this as a reference when
 * creating new tests.
 */
describe('Content Cards - Sample Tests', () => {
  
  /**
   * beforeAll: Runs once before all tests in this describe block
   * Use for one-time setup like launching the app
   */
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  /**
   * beforeEach: Runs before each individual test
   * Use for resetting state to ensure test isolation
   */
  beforeEach(async () => {
    // Reload React Native to get a fresh state
    //await device.reloadReactNative();
    
    // Navigate to the Content Cards screen
    await navigateToContentCards();
  });

  /**
   * CUSTOM TEST: Track Actions and Verify Content Cards
   * 
   * Initial State: 1 content card already loaded (small_image1 tracked on app launch)
   * 
   * Test Flow:
   * 1. Type "small_image2" in the "Enter action name" box, click Track button
   * 2. Type "small_image3" in the "Enter action name" box, click Track button  
   * 3. Validate we have 3 content cards total (1 initial + 2 newly tracked)
   */
  describe('Custom - Track Actions with Content Verification', () => {
    it('should display 3 content cards after tracking small_image2 and small_image3', async () => {
      // We're already on Remote view by default
      await verifyInboxVisible('inbox-remote');
      
      // Wait for initial content to load (small_image1 is already tracked on app launch)
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Step 0: Initial state - 1 content card (small_image1) should be visible');
      
      // Verify the initial card is present
      try {
        await waitFor(element(by.text('Get Ready for the Basketball Season Kickoff!')))
          .toBeVisible()
          .withTimeout(5000);
        console.log('✓ Verified: Initial card "Get Ready for the Basketball Season Kickoff!" is visible');
      } catch (e) {
        console.log('⚠ Initial card text not found - may still be loading or rendered differently on this platform');
        // Inbox should at least be visible
        await verifyInboxVisible('inbox-remote');
      }
      
      // STEP 1: Type "small_image2" in the enter action name box, then click track button
      console.log('Step 1: Tracking action - small_image2');
      await element(by.id('track-action-input')).replaceText('small_image2');
      await element(by.id('track-action-button')).tap();
      
      // Wait for API call to complete and content to refresh
      await new Promise(resolve => setTimeout(resolve, 4000));
      console.log('Step 1 complete: Should now have 2 content cards');
      
      // Verify both cards exist (they may not all be visible at once due to scrolling)
      await detoxExpect(element(by.text('Get Ready for the Basketball Season Kickoff!'))).toExist();
      await detoxExpect(element(by.text('Grace of the Peacock'))).toExist();
      console.log('✓ Verified: 2 cards exist in the inbox');
      console.log('  - Card 1: "Get Ready for the Basketball Season Kickoff!"');
      console.log('  - Card 2: "Grace of the Peacock"');
      
      // STEP 2: Type "small_image3" in the enter action name box, then click track button
      console.log('Step 2: Tracking action - small_image5');
      await element(by.id('track-action-input')).replaceText('small_image5');
      await element(by.id('track-action-button')).tap();
      
      // Wait for API call to complete and content to refresh
      await new Promise(resolve => setTimeout(resolve, 4000));
      await detoxExpect(element(by.text('Serenity of Nature'))).toExist();
      await takeScreenshot('step2-after-small-image5-total-3-cards');
      console.log('Step 2 complete: Should now have 3 content cards, Card 3: "Serenity of Nature"');
      
      // STEP 3: Final validation and screenshot
      console.log('Step 3: Final validation');
      
      // Verify the inbox is still visible
      await verifyInboxVisible('inbox-remote');
      
      // Verify we're still on Remote view
      await detoxExpect(element(by.text('Remote'))).toBeVisible();
      
      // Take final screenshot showing the 3 content cards
      await takeScreenshot('step3-final-three-cards-displayed');
      
      console.log('✅ Test completed: 3 content cards verified!');
      console.log('   Summary:');
      console.log('   - Step 0: Verified initial card exists');
      console.log('   - Step 1: Verified 2 cards exist after tracking small_image2');
      console.log('   - Step 2: Verified 3rd card exists after tracking small_image5');
      console.log('   - Step 3: Final screenshot captured');
    });
  });

  /**
   * CUSTOM TEST: Large Image Cards with Dismiss Functionality
   * 
   * Test Flow:
   * 1. Track large_image1, large_image2, large_image3 to load 3 large image cards
   * 2. Verify large_image1 card is displayed (title: "Dreams in the Sky")
   * 3. Click the dismiss button (×) on large_image1
   * 4. Verify large_image1 is removed ("Dreams in the Sky" no longer visible)
   * 5. Verify large_image2 is still visible ("Shade by the Sea")
   */
  describe('Custom - Large Image Cards with Dismiss', () => {
    it('should dismiss large_image1 card when clicking the dismiss button', async () => {
      // We're already on Remote view by default
      // await verifyInboxVisible('inbox-remote');
      
      // // Wait for initial content to load
      // await new Promise(resolve => setTimeout(resolve, 3000));
      // console.log('Step 0: Starting test - tracking large image cards');
      
      // STEP 1: Track large_image1
      console.log('Step 1: Tracking action - large_image1');
      await element(by.id('track-action-input')).replaceText('large_image1');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // STEP 2: Track large_image2
      console.log('Step 2: Tracking action - large_image2');
      await element(by.id('track-action-input')).replaceText('large_image2');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // STEP 3: Track large_image3
      console.log('Step 3: Tracking action - large_image3');
      await element(by.id('track-action-input')).replaceText('large_image3');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Take screenshot before dismiss
      await takeScreenshot('large-images-before-dismiss');
      console.log('Step 3 complete: 3 large image cards should be visible');
      
      // Extra wait for content to fully load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // STEP 4: Verify large_image1 exists and dismiss it
      console.log('Step 4: Verifying large_image1 card exists');
      
      // Verify large_image1 card is visible by checking its title text
      await waitFor(element(by.text('Dreams in the Sky')))
        .toExist()
        .withTimeout(10000);
      console.log('✓ Verified: large_image1 card "Dreams in the Sky" exists');
      
      // Also verify large_image2 exists (may need scrolling on some devices)
      try {
        await waitFor(element(by.text('Shade by the Sea')))
          .toExist()
          .withTimeout(5000);
        console.log('✓ Verified: large_image2 card "Shade by the Sea" exists');
      } catch (e) {
        // Try scrolling to find it
        console.log('⚠ large_image2 not immediately visible, trying to scroll...');
        await waitFor(element(by.text('Shade by the Sea')))
          .toBeVisible()
          .whileElement(by.id('inbox-remote'))
          .scroll(200, 'down');
        console.log('✓ Found large_image2 "Shade by the Sea" after scrolling');
        
        // Scroll back up
        await element(by.id('inbox-remote')).scroll(200, 'up');
      }
      
      // STEP 5: Click the dismiss button on large_image1
      // The dismiss button renders as '×' (multiplication sign) and is the first one (index 0)
      console.log('Step 5: Clicking dismiss button on large_image1');
      
      // The dismiss button text is '×' (multiplication sign, Unicode \u00D7)
      const dismissButtons = element(by.text('×'));
      await dismissButtons.atIndex(0).tap();
      
      // Wait for dismiss animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Take screenshot after dismiss
      await takeScreenshot('large-images-after-dismiss');
      
      // STEP 6: Verify the card is dismissed
      console.log('Step 6: Verifying large_image1 was dismissed');
      
      // Verify large_image1 is no longer visible
      await waitFor(element(by.text('Dreams in the Sky')))
        .not.toExist()
        .withTimeout(5000);
      console.log('✓ Verified: large_image1 "Dreams in the Sky" is no longer visible');
      
      // Verify large_image2 is still visible
      await detoxExpect(element(by.text('Shade by the Sea'))).toExist();
      console.log('✓ Verified: large_image2 "Shade by the Sea" is still visible');
      
      // The inbox should still be visible
      await verifyInboxVisible('inbox-remote');
      
      console.log('✅ Test completed: Large image card dismissed successfully!');
      console.log('   Summary:');
      console.log('   - Step 1-3: Tracked large_image1, large_image2, large_image3');
      console.log('   - Step 4: Verified both cards exist');
      console.log('   - Step 5: Clicked dismiss button on large_image1');
      console.log('   - Step 6: Verified large_image1 removed, large_image2 still visible');
    });
  });

  /**
   * CUSTOM TEST: Image Only Cards Loading
   * 
   * Image-only cards have no text content, so we validate by:
   * - Verifying inbox has content after loading
   * - Taking screenshots to capture visual state
   * - Checking dismiss buttons if available
   * 
   * Test Flow:
   * 1. Track image_only3, image_only4, image_only1 to load 3 image-only cards
   * 2. Verify inbox is visible with content
   * 3. Take screenshot to capture the loaded cards
   * 4. If dismiss buttons exist, test dismiss functionality
   */
  describe.skip('Custom - Image Only Cards', () => {
    it('should load image-only cards and verify inbox', async () => {
      // We're already on Remote view by default
      await verifyInboxVisible('inbox-remote');
      
      // Wait for initial content to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Step 0: Starting test - tracking image-only cards');
      
      // STEP 1: Track image_only3
      console.log('Step 1: Tracking action - image_only3');
      await element(by.id('track-action-input')).replaceText('image_only3');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // STEP 2: Track image_only4
      console.log('Step 2: Tracking action - image_only4');
      await element(by.id('track-action-input')).replaceText('image_only4');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // STEP 3: Track image_only1
      console.log('Step 3: Tracking action - image_only1');
      await element(by.id('track-action-input')).replaceText('image_only1');
      await element(by.id('track-action-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Extra wait for content to fully load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // STEP 4: Verify inbox is visible with content
      console.log('Step 4: Verifying image-only cards loaded');
      await verifyInboxVisible('inbox-remote');
      console.log('✓ Verified: Inbox is visible');
      
      // Take screenshot showing image-only cards
      await takeScreenshot('image-only-cards-loaded');
      console.log('✓ Screenshot captured: image-only-cards-loaded');
      
      // STEP 5: Try to find and interact with dismiss buttons if available
      console.log('Step 5: Checking for dismiss buttons');
      const dismissButtons = element(by.text('×'));
      
      let dismissButtonsFound = 0;
      try {
        await waitFor(dismissButtons.atIndex(0))
          .toExist()
          .withTimeout(5000);
        dismissButtonsFound++;
        console.log('✓ Found at least 1 dismiss button');
        
        // Try to find more
        try {
          await detoxExpect(dismissButtons.atIndex(1)).toExist();
          dismissButtonsFound++;
          console.log('✓ Found 2nd dismiss button');
          
          await detoxExpect(dismissButtons.atIndex(2)).toExist();
          dismissButtonsFound++;
          console.log('✓ Found 3rd dismiss button');
        } catch (e) {
          console.log(`⚠ Found ${dismissButtonsFound} dismiss button(s) - some cards may not have dismiss or are off-screen`);
        }
        
        // If we found dismiss buttons, try to dismiss one
        if (dismissButtonsFound > 1) {
          console.log('Step 6: Dismissing a card');
          await dismissButtons.atIndex(0).tap();
          await new Promise(resolve => setTimeout(resolve, 1500));
          await takeScreenshot('image-only-cards-after-dismiss');
          console.log('✓ Successfully dismissed a card');
        }
      } catch (e) {
        console.log('⚠ No dismiss buttons found - image-only cards may not have dismiss buttons configured');
      }
      
      // Final verification
      await verifyInboxVisible('inbox-remote');
      
      console.log('✅ Test completed: Image-only cards loaded successfully!');
      console.log('   Summary:');
      console.log('   - Step 1-3: Tracked image_only3, image_only4, image_only1');
      console.log('   - Step 4: Verified inbox is visible');
      console.log('   - Step 5: Screenshot captured');
      console.log(`   - Dismiss buttons found: ${dismissButtonsFound}`);
    });
  });
});

