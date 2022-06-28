/** ------------ **/
/*   Offline DB   */
/*     Author     */
/*  YasinAkimura  */
/* -------------- */
import AsyncStorage from '@react-native-async-storage/async-storage';

interface KeyStore{
    store: string;
    value: string[];
}
/**
 * @param id to select one specific row or multiple using numbers[]
 * @param filter used to filter through the given data returns only the matching rows
 * @param desc defaults to true for descending order. (false: ascending)
 * @param amount length of the action on the table
 * @dependency StorageHandler
 */
interface QueryConfig{
    id?: number | number[];
    desc?: boolean;
    amount?: number;
}
/** 
 * Default result DataFormat
 * @param ID table Key which the data belongs to
 * @param data result object of the specific table format
 */
interface ResulSet<M>{
    ID: string;
    data: M;
}
class StorageHandler {
    private debug: boolean = false;
    /**
     * Insertion method that logs the data in a " :list" pair index to find the data
     * @param into_table the TABLE the data will be inserted to
     * @param data with type T defines the structure and values of those
     */
    public async insert<T>(into_table: string, data:T): Promise<boolean> {
        try{
            /** The keyStore of Table */
            let keyStore: KeyStore | undefined;
            let newKey: string = '';
            let debug = (this.debug)? this.debugOutput('log_insert') : undefined;
            let tableList = await AsyncStorage.getItem(into_table+':list', debug);
            if(tableList != null){
                keyStore = JSON.parse(tableList);
                if(keyStore && keyStore.store == into_table){
                    newKey = into_table + ':' + (keyStore.value.length+1);
                    keyStore.value.push(newKey);
                    await AsyncStorage.setItem(into_table+':list', JSON.stringify(keyStore));
                }
            } else {
                newKey = into_table+':'+1;
                let keyStore:KeyStore = {
                    store: into_table,
                    value: [newKey]
                };
                await AsyncStorage.setItem(into_table+':list', JSON.stringify(keyStore));
            }
            if(newKey.length > 0)
                await AsyncStorage.setItem(newKey, JSON.stringify(data));
            else throw Error("No new Key was created please debug code");
        } catch(e){
            if(e) console.log(e);
        }
        return true;
    }
    /**
     * A simple selection method which can get: specific results or resultset from table
     * @todo select one specific row ID or Filtered by data
     * @param tableKey the Key of the table
     * @param config settings to match a more specific selection
     * @returns ResultSet<T>[] | null 
     */
    public async select<T>(tableKey:string, config?: QueryConfig): Promise<ResulSet<T>[] | null>{
        try{
            let output: ResulSet<T>[] = new Array();
            let isDesc: boolean = config?.desc ?? true;
            /** The keyStore of Table */
            let keyStore: KeyStore | undefined;
            let debug = (this.debug)? this.debugOutput('log_select') : undefined;
            let tableList = await AsyncStorage.getItem(tableKey+':list', debug);
            if(tableList != null){
                keyStore = JSON.parse(tableList);
                if(keyStore && keyStore.store == tableKey){
                    /** GET SPECIFIC ROWS LOGIC */
                    if(config?.id) keyStore = this.reduceKeyStore(keyStore, config.id);
                    /** END OF GET SPECIFIC ROWS LOGIC */
                    let tableLength = keyStore.value.length;
                    let resultLength = config?.amount ?? 25;
                    let keyArray: string[] = new Array();
                    let start = isDesc ? tableLength : 1;
                    let itemSet: [string, string | null][];
                    /** Pushs any itemSet to the output ResultSet<T> */
                    let setResultSet = (itemSet: [string, string | null][]): void => {
                        itemSet.forEach((item)=>{
                            let innerData: string = item[1] ?? '';
                            if(innerData){
                                let data: ResulSet<T> = {
                                    ID: item[0],
                                    data: JSON.parse(innerData)
                                }
                                output.push(data);
                            }
                        })
                    }
                    if(config?.amount != -1){
                        //logic which decides the order of the Keys of Table
                        let length = isDesc? tableLength-resultLength <= 0? 0 : tableLength-resultLength : 
                                            tableLength < resultLength? tableLength : resultLength;
                        for(let i=start-1;isDesc? i >= length : i < length; isDesc? i-- : i++) 
                            keyArray.push(keyStore.value[i]);
                        //end of Order logic
                        itemSet = await AsyncStorage.multiGet(keyArray);
                    } else itemSet = await AsyncStorage.multiGet(keyStore.value);
                    setResultSet(itemSet);
                    if(this.debug) console.log(itemSet,'log_itemSet');
                    return output;
                }
            } 
        } catch(e){
            if(e) console.error(e);
        }
        return null;
    }
    /**
     * A simple remove method which can remove: specific result, resultset or everything from table
     * @param tableKey the Key of the table
     * @param config settings to match a more specific selection
     * @param config.amount amount of KeyPairs to remove defaults to 1 please be specific
     */
    public async remove(tableKey:string, config?: QueryConfig){
        try{
            let isDesc: boolean = config?.desc ?? true;
            /** The keyStore of Table */
            let keyStore: KeyStore | undefined;
            let debug = (this.debug)? this.debugOutput('log_remove') : undefined;
            let tableList = await AsyncStorage.getItem(tableKey+':list', debug);
            if(tableList != null){
                keyStore = JSON.parse(tableList);
                if(keyStore && keyStore.store == tableKey){
                    /** GET SPECIFIC ROWS LOGIC */
                    if(config?.id) keyStore = this.reduceKeyStore(keyStore, config.id);
                    /** END OF GET SPECIFIC ROWS LOGIC */
                    let tableLength = keyStore.value.length;
                    let resultLength = config?.amount ?? 1;
                    let keyArray: string[] = new Array();
                    let start = isDesc ? tableLength : 1;
                    if(config?.amount != -1){
                        /** ORDER LOGIC: decides the order of the Keys of Table */
                        let length = isDesc? tableLength-resultLength <= 0? 0 : tableLength-resultLength : 
                                             tableLength < resultLength? tableLength : resultLength;
                        for(let i=start-1;isDesc? i >= length : i < length; isDesc? i-- : i++) 
                            keyArray.push(keyStore.value[i]);
                        /** END OF ORDER LOGIC */
                        /** REMOVE LOGIC */
                        await AsyncStorage.multiRemove(keyArray);
                        keyStore.value = keyStore.value.filter((x)=>x != keyArray.find((k)=>k == x));
                        await AsyncStorage.setItem(tableKey+':list', JSON.stringify(keyStore));
                        if(this.debug) console.log(keyStore.value);
                        if(this.debug) console.log(keyArray,' - successfully removed');
                        /** END OF REMOVE LOGIC */
                        return;
                    }
                    /** REMOVE LOGIC */
                    await AsyncStorage.multiRemove(keyStore.value);
                    await AsyncStorage.removeItem(tableKey+':list');
                    if(this.debug) console.log(keyStore.value,' - successfully removed');
                    /** END OF REMOVE LOGIC */
                    return;
                }
            } 
        } catch(e){
            if(e) console.log(e);
        }
    }
    public async updateData<T>(tableKey:string,data:T, config?: QueryConfig): Promise<void>{
        try{
            config = config ?? {amount:1};
            let itemSet = await this.select<T>(tableKey,config);
            let setItem: [string, string][] = new Array();
            itemSet?.forEach((x)=>{
                x.data = data;
                setItem.push([x.ID,JSON.stringify(x.data)]);
                if(this.debug) console.log([x.ID,JSON.stringify(x.data)])
            });
            if(itemSet) await AsyncStorage.multiSet(setItem);
            console.log(setItem.length,'row updated')
        } catch(e){
            if(e) console.error(e);
        }
    }
    /**
     * Reduces the KeyStore to only match those items with given ID-SET
     * @param keyStore current KeyStore
     * @param id is used to reduce the KeyStore
     * @returns reduced keyStore
     */
    private reduceKeyStore(keyStore: KeyStore, id: number | number[]): KeyStore{
        if(typeof id == 'number')
            keyStore.value = keyStore.value.filter((item)=>item == keyStore.store+':'+id);
        else 
            keyStore.value = keyStore.value.filter((item)=>{
                if(typeof id != 'number') 
                    for(let row in id) 
                        return item == keyStore.store+':'+row;
            });
        return keyStore;
    }
    private debugOutput(debugType: string): (e?:Error,r?:string)=>void{
        return (e?:Error,r?:string) => {
            if(e) console.log(e.message);
            if(r) console.log(r,debugType);
        }
    }
}
const StorageHandlerStatic = new StorageHandler();
export default StorageHandlerStatic as StorageHandler;