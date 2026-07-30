import { test, expect } from '@fixtures/testFixtures';

test.describe('Login and profile UI', () => {
  test('should login with a user created through the API', 
    async ({ loginPage, profilePage, accountApi, testUser }) => {
    const createdUser = await accountApi.createUser(testUser);
    const tokenResponse = await accountApi.generateToken(testUser);
    console.log('Created user:', createdUser.username);
    console.log('Generated token:', tokenResponse.token);
    
    expect(tokenResponse.token).toBeTruthy();

    await loginPage.goto();
    await loginPage.login(testUser.userName, testUser.password);

    await profilePage.waitForLoaded();
    await profilePage.expectUsername(createdUser.username);
    await profilePage.deleteAccount();
  });
});
