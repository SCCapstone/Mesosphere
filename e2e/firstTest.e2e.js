//const { reloadApp } = require('detox-expo-helpers');

describe('LandingElements', () => {
  beforeAll(async () => {
    await device.launchApp();
    //await reloadApp();
  });
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  test('LoginScreenDisplays', async() => {
    await expect(element(by.id('LoginUserPrompt'))).toBeVisible();
    await expect(element(by.id('LoginPassPrompt'))).toBeVisible();
    await expect(element(by.id('LoginButton'))).toBeVisible();
    await expect(element(by.id('RegisterButton'))).toBeVisible();
 });

});