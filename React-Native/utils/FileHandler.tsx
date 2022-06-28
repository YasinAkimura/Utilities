import * as FileSystem from 'expo-file-system';
export class FileHandler{
    public static async createDirectory(directory: string): Promise<void>{
        let response = await FileSystem.getInfoAsync(FileSystem.documentDirectory+directory);
        if(!response.isDirectory) 
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory+directory);
    }
    public static async moveFromCache(fromPath: string, toPath: string){
        await FileSystem.moveAsync({from: fromPath, to: toPath});
    }
    public static async getDirectory(directory: string): Promise<string>{
        if(!FileSystem.documentDirectory) throw Error("No document directionary available");
        let response = await FileSystem.getInfoAsync(FileSystem.documentDirectory+directory);
        if(response.isDirectory) 
            return FileSystem.documentDirectory+directory;
        return '';
    }
    public static async uploadFile(filePath: string){
        await FileSystem.uploadAsync(FileSystem.documentDirectory+filePath,filePath)
    }

}