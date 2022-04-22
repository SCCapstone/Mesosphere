import { checkLogin, getUsername, deleteCurrUser, makeAcc, makeAdminAcc, makeDemoAcc } from '../../User'
import { getData, setUser, getUser } from '../../Utility'
import pushAccountToDatabase, { doesAccountExist, doesUsernameExist, removeAccountFromDatabase } from '../../firebaseConfig'

//Tests of database reading - using Kevin's acc as a base
test('App reads data from the database', async () => {
  const data = await doesUsernameExist('KTP')
  expect(data).toBe(true)
});

test('App reads data from the database but false', async () => {
  const data = await doesUsernameExist('IAmAUserThatDoesNotExist')
  expect(data).toBe(false)
});

test('App reads account data from the database but false', async () => {
  const data = await doesAccountExist('meso-22b1213fc7c')
  expect(data).toBe(true)
});

test('App reads account data - but false', async () => {
  const data = await doesAccountExist('meso-22b1213fc7cp')
  expect(data).toBe(false)
});


test('App reads account data - but false', async () => {
  await makeAcc('someUsernameNotThereYet', '1234', 'No Names', 'bio')
  const u = getUser()
  console.log(u)
  const data1 = await doesUsernameExist('someUsernameNotThereYet')
  expect(data1).toBe(true)
  //removeAccountFromDatabase(u)
});


//Validation Checks
test('Username Validation Check', async () => {
  makeAcc('no', '1234', 'No Names', 'bio')
  const data1 = await doesUsernameExist('no')
  expect(data1).toBe(false)
});

test('Display Name Validation Check', async () => {
  makeAcc('actual', '1234', 'No', 'bio')
  const data1 = await doesUsernameExist('actual')
  expect(data1).toBe(false)
});