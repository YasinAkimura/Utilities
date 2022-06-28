
/** ------------ **/
/*   Offline DB   */
/*     Author     */
/*  YasinAkimura  */
/* -------------- */
import { FileHandler } from '../FileHandler';
import StorageHandler from '../StorageHandler';
async function resetUser(){
    StorageHandler.remove('User:1:images',{amount:-1});
    StorageHandler.remove('User');
}
//resetUser();
interface Birthday {
    day: number;
    month: number;
    year: number;
}
interface UserDB {
    user: string;
    data: UserConfig;
}
interface UserImage {
    uri: string;
}
export type UserConfig = {
    name: string;
    lastname: string;
    residence: string;
    gender?: 'male' | 'female' | 'Kaempfhelicopter';//LGBTQ WER
    weight: number;
    height: number;
    birthday?: Birthday;
    emptyPromise?: boolean;
}
class User {
    private static user?: UserDB;
    private userID: number = 1;
    constructor(user?: UserDB){
        User.user = user;
    }
    public setUser(user: UserDB){
        User.user = user;
    }
    /**
     * 
     * @param user random Username if multi user support is planned
     * @param config is optional and depends on if the user wants to create a user
     * @returns a promise which will be true if creation was successful
     */
    public async createUser(user:string, config?: UserConfig): Promise<boolean>{
        let userConfig: UserConfig = config ?? {
            name: '',
            lastname: '',
            residence: '',
            gender: undefined,
            weight: 0,
            height: 0,
            birthday: undefined
        };
        let data: UserDB = {
            user: user,
            data: userConfig
        }
        return await StorageHandler.insert<UserDB>('User', data);
    }
    public async getUserData(setUser?: boolean): Promise<UserConfig>{
        if(User.user && !setUser) return User.user.data;
        let user = await StorageHandler.select<UserDB>('User', {id:this.userID,amount:1});
        if(user && user.length > 0){
            if(setUser) this.setUser(user[0].data);
            return user[0].data.data;
        } 
        return this.getDefaultUser();
    }
    public async getUserImage(): Promise<UserImage>{
        let tableKey = 'User:'+this.userID+':images';
        let imageSet = await StorageHandler.select<UserImage>(tableKey, {amount:10});
        if(imageSet && imageSet.length > 0){
            // console.log(imageSet[imageSet.length-1].ID);
            return imageSet[imageSet.length-1].data;
        }
        return {uri: ''};
    }
    public getDefaultUser(): UserConfig{
        return {name:' ',lastname:' ',birthday:{day: 0,month:0,year:0},weight:0,residence:' ',height:0, emptyPromise:true};
    }
    public getAge(birthday?: Birthday): number{
        let age = 0;
        let curDate = new Date();
        if(birthday){
            age = curDate.getFullYear() - birthday.year;
            age -= (curDate.getMonth() < birthday.month)? 1 : ((curDate.getMonth() == birthday.month && curDate.getDay() < birthday.day)? 1 : 0);
        }
        return age;
    }
    public async setUserImage(data:string): Promise<boolean>{
        const tableKey = 'User:'+this.userID+':images';
        await FileHandler.createDirectory(tableKey);
        let directory = await FileHandler.getDirectory(tableKey);
        await FileHandler.moveFromCache(data, directory+'/userimage.'+data.split('.')[1]);
        console.log(directory+'/userimage.'+data.split('.')[1]);
        return await StorageHandler.insert<UserImage>(tableKey, {uri:directory+'/userimage.'+data.split('.')[1]});
    }
    public async updateUserData<K extends keyof UserConfig>(type: K, data: UserConfig[K]): Promise<void>{
        let userDB = User.user;
        if(userDB){
            userDB.data[type] = data;
            await StorageHandler.updateData<UserDB>('User', userDB,{id: this.userID, amount: 1});
        }
    }
}
export const UserHandler = new User();