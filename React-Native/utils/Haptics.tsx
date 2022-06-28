import {Vibration} from 'react-native';
import * as Haptic from 'expo-haptics';

export default class Haptics{
    public static async impactAsync(style?: 'light' | 'medium' | 'heavy'){
        try{
            switch (style) {
                case 'light':
                await Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
                break;
                case 'medium':
                await Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
                break;
                default:
                await Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
                break;
            }
        } catch(e){
            console.log(e)
        }
    }
    public static async goBackHaptic(){
        await Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
        setTimeout(()=>{
            Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
        },200);
    }
}