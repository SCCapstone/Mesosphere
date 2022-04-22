import {Post} from '../../Post'
import { alterPostScoreClean, doesPostExist, getScoreFromPostInDatabase, pushPostToDatabase, removePostFromDatabase } from '../../firebaseConfig'

test('Create post and push to database.', async () => {
    var p1 = new Post("meso-229a6114ef7", "p1", null, "p1 -- test", 0, [], new Date().toString().substring(0, 24));
    await pushPostToDatabase(p1)
    const result = await doesPostExist('p1')
    expect(result).toBe(true)
});

test ('Increment post score by 1.', async () => {
    await alterPostScoreClean('p1', 1)
    const p1_score_1 = await getScoreFromPostInDatabase('p1')
    expect(p1_score_1).toBe(1)
    await alterPostScoreClean('p1', -1)
})

test ('Decrement post score by 1.', async () => {
    await alterPostScoreClean('p1', -1)
    const p1_score_1 = await getScoreFromPostInDatabase('p1')
    expect(p1_score_1).toBe(-1)
    await alterPostScoreClean('p1', 1) // put back to zero
})



