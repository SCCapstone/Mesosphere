import { checkLogin, getUsername, deleteCurrUser, makeAcc, makeAdminAcc, makeDemoAcc } from '../../User'
import { getData, setUser, getUser } from '../../Utility'
import pushAccountToDatabase, { doesAccountExist, doesUsernameExist, pushUsernameToDatabase, removeAccountFromDatabase, removeUsernameFromDatabase } from '../../firebaseConfig'
import { atom } from 'elementos'

const currUser$ = atom(null)

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

test('Push User Name to DB', async () => {
  const data0 = await doesUsernameExist('someUserName!')
  expect(data0).toBe(false)

  await pushUsernameToDatabase('someUserName!')
  const data = await doesUsernameExist('someUserName!')

  expect(data).toBe(true)
  await removeUsernameFromDatabase('someUserName!')
});