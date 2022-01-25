import { checkLogin, makeAdminAcc, makeDemoAcc } from "../../User";
import { getData, setUser } from "../../Utility"

describe('User', () => {
    it('Demo account creation is successful.', () => {
        makeDemoAcc()
        return getData("meso-1").then(data => {
            expect(data).toStrictEqual({"username":"Demo","password":"ccc9c73a37651c6b35de64c3a37858ccae045d285f57fffb409d251d","realName":"VeryReal Nameson","biography":"I do so enjoy my <activies>","MiD":"meso-1","myPosts":[],"myPeers":[]})
        })
    })
    it('Admin account creation is successful.', () => {
        makeAdminAcc()
        return(getData("meso-0").then(data => {
            expect(data).toStrictEqual({"username":"admin","password":"8f95cfb66890ae8130f3ae7ec288d43ba0d898d60a0823788c6b3408","realName":"Administrator","biography":"It's a Messosphere in here.","MiD":"meso-0","myPosts":[],"myPeers":[]})
        }))
    })
    // it('Create user is successful.', () => {
        
    // })
})