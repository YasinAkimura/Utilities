import React from 'react';
import {Text,TextProps} from 'react-native';
import {Colors} from '../styles/css';
interface TextPropsV2 extends TextProps{
    icon?: string,
    size?: number,
    top?: number,
    color?: string,
    elevation?: number,
    left? : number,
    marginLeft?: number,
    opacity?: number,
    rotate?: number,
}
export default class Icon extends React.Component<TextPropsV2>{
    private getFontIcon(icon: string | number | undefined):string {
        var value: string = "Regular";
        if(typeof icon != undefined)
            switch((typeof icon == "string") ? icon.toLowerCase() : icon){
                case (typeof icon == "string") ? "pause" : 100:
                    value = "A";
                break;
                case (typeof icon == "string") ? "food": 200:
                    value = "B";
                break;
                case (typeof icon == "string") ? "user" : 300:
                    value = "C";
                break;
                case (typeof icon == "string") ? "burn" : 400:
                    value = "D";
                break;
                case (typeof icon == "string") ? "date" : 500:
                    value = "E";
                break;
                case (typeof icon == "string") ? "settings" : 600:
                    value = "F";
                break;
                case (typeof icon == "string") ? "plus" : 700:
                    value = "G";
                break;
                case ((typeof icon == "string") ? "list" : 800):
                    value = "H";
                break;
                case (typeof icon == "string") ? "home" : 900:
                    value = "I";
                break;
                case (typeof icon == "string") ? "workout" : 1000:
                    value = "J";
                break;
                case (typeof icon == "string") ? "training" : 1100:
                    value = "K";
                break;
                case (typeof icon == "string") ? "more" : 1200:
                    value = "L";
                break;
                case (typeof icon == "string") ? "arrow" : 1300:
                    value = "M";
                break;
                case (typeof icon == "string") ? "question" : 1400:
                    value = "N";
                break;
                case (typeof icon == "string") ? "search" : 1400:
                    value = "O";
                break;
                case (typeof icon == "string") ? "goal" : 1500:
                    value = "P";
                break;
                case (typeof icon == "string") ? "statistic" : 1600:
                    value = "Q";
                break;
                case (typeof icon == "string") ? "exercises" : 1700:
                    value = "R";
                break;
                case (typeof icon == "string") ? "download" : 1800:
                    value = "S";
                break;
                case (typeof icon == "string") ? "user-edit" : 1900:
                    value = "T";
                break;
                case (typeof icon == "string") ? "barcode" : 2000:
                    value = "U";
                break;
                case (typeof icon == "string") ? "minus" : 2100:
                    value = "V";
                break;
                default:
                    value = "not found";
            }
        return value;
    }
    render(){
        return(
            <Text style={{
                left: this.props.left,
                marginLeft: this.props.marginLeft,
                top: this.props.top,
                fontFamily:'weyau-font',
                elevation: this.props.elevation,
                opacity: this.props.opacity,
                color: (this.props.color != undefined)? this.props.color : Colors.defaultTextColor,
                fontSize: (this.props.size != undefined)? this.props.size : 16,
                transform: this.props.rotate? [{rotate: this.props.rotate+'deg'}] : undefined,
            }}>
                   {this.getFontIcon(this.props.icon)}
            </Text>
        )
    }
}