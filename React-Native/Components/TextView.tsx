import React from 'react';
import {Text as TextOld,TextProps} from 'react-native';
import {Colors} from '../styles/css';
import TextData from '../utils/TextData';
interface TextPropsV2 extends TextProps{
    fontWeight?: string | number,
    size?: number,
    color?: string,
    elevation?: number,
    marginLeft?: number,
    left? : number,
    opacity?: number,
    lineHeight?: number,
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify',
}
interface TextState {
    value?: String;
}
export class TextView extends React.Component<TextPropsV2,TextState>{
    //private textView: Text | null = null;
    public state:TextState = {value: undefined};
    private textRef = React.createRef<TextOld>();
    public setNativeProps(props: TextProps): void{
        this.textRef.current?.setNativeProps(props);
    }
    public setValue(value: string){
        this.setState({value: value});
    }
    render(){
        return(
            <TextOld ref={this.textRef} style={{
                opacity: this.props.opacity,
                marginLeft: this.props.marginLeft,
                left: this.props.left,
                marginBottom: this.props.lineHeight,
                textAlign: this.props.textAlign,
                fontFamily:TextData.defaultFontFamily+TextData.getFontWeight(this.props.fontWeight),
                elevation: this.props.elevation,
                color: (this.props.color != undefined)? this.props.color : Colors.defaultTextColor,
                fontSize: (this.props.size != undefined)? this.props.size : 16,
            }}>
                    {this.state.value? this.state.value : this.props.children}
            </TextOld>
        )
    }
}