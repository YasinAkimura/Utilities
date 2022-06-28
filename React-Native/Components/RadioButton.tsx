import React from 'react';
import { ViewStyle } from 'react-native';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import { runOnUI } from 'react-native-reanimated';
import { ColorType } from './types';
import Haptics from '../utils/Haptics';
import Icon from './Icon';
import {TextView} from './TextView';
interface RadioProps {
    groupId: string | number;
    /**the unique ItemID for the group*/
    id: number;
    color?: ColorType;
    customStyle?: ViewStyle;

    small?: boolean;
    focus?: boolean;
    title?: string;
    lineOne?: string;
    lineTwo?: string;
    shadowStrength?: 'weak' | 'strong';
    transparentBorder?: boolean;
    customEvent?: (radio:boolean, options:optionType) => void;
    /**set true for console output DEVONLY*/
    debug?: boolean;
    parent?: any;
}
export type optionType = {
    itemId: number;
    groupId: string | number;
    someSelected: boolean;
}
type radioGroup = {
    id: string | number;
    set?: {
        id: string | number;
        set: boolean;
        update: () => void;
    }[];
}
type staticRadioType = {
    group: radioGroup[]
}
export default class RadioButton extends React.Component<RadioProps>{
    static radioState: staticRadioType = {
        group: []
    };
    constructor(props: RadioProps){
        super(props);
    }
    componentDidMount(){
        let itemId = this.props.id;
        let group = this.findGroupById(this.props.groupId);
        if(group){
            if(!this.isItemInGroup(group.id,itemId))
                group.set?.push({id: itemId, set: this.props.focus? true : false, update: ()=> this.forceUpdate() })
            else if(this.props.debug) console.log('NANI?! Yo id kam doppelt vor');
        } else {
            let currentGroup: radioGroup = {
                id: this.props.groupId,
                set: []
            }
            currentGroup.set?.push({id: itemId, set: this.props.focus? true : false, update: ()=> this.forceUpdate()  });
            RadioButton.radioState.group.push(currentGroup);
        }
        this.setState({group: RadioButton.radioState.group.find((x)=>x.id == this.props.id)});
    }
    componentWillUnmount(){
        this.deleteCurrentGroup();
    }
    private deleteCurrentGroup(){
        let groups = RadioButton.radioState.group.filter((x)=>x.id != this.props.groupId);
        RadioButton.radioState.group = groups;
    }
    private isItemInGroup(groupId: string | number, itemId: string | number): boolean{
        let group = this.findGroupById(groupId);
        let item = undefined;
        if(group) item = group.set?.find((x)=>x.id == itemId);
        return item? true : false;
    }
    private findGroupById(id: string | number): radioGroup | undefined {
        return RadioButton.radioState.group.find((x)=>x.id == id);
    }
    private radioPressEvent(ev: GestureResponderEvent){
        'worklet';
        if(this.props.debug)
            console.log('pressed item with id: ', this.props.id, '\ngroup with id:', this.props.groupId);
        let options: optionType = {
            itemId: this.props.id,
            groupId: this.props.groupId,
            someSelected: false,
        }
        let group: radioGroup | undefined = this.findGroupById(options.groupId);
        let radio: boolean = false;
        group?.set?.forEach((x)=>{
            x.set = (x.id == options.itemId && !x.set);
            x.update();
            if(x.set && !options.someSelected) options.someSelected = true;
            if(x.id == options.itemId) radio = x.set;
        });
        Haptics.impactAsync('medium');
        if(this.props.customEvent)
            this.props.customEvent(radio, options);
            
    }
    render(){
        let Colors = this.props.color;
        return (
            <Pressable onPress={runOnUI(this.radioPressEvent.bind(this))} 
                style={[
                this.props.customStyle || {
                    shadowColor:'#000000',
                    shadowOpacity:this.props.shadowStrength == 'weak'? 0.16 : 0.15,
                    shadowOffset:{
                        width:0,
                        height:this.props.shadowStrength == 'weak'? 1.5 : 3
                    },
                    shadowRadius:this.props.shadowStrength == 'weak'? 2.00 : 6.00,
                    elevation:4,
                    width: this.props.small? undefined : 145,
                    height: this.props.small? 42.5 : 100,
                    paddingHorizontal: this.props.small? 7 : undefined,
                    borderWidth:1.5,
                    borderRadius:this.props.small? 5 : 8,
                },{
                    backgroundColor:Colors? Colors.containerBox : 'transparent',
                    borderColor:(RadioButton.radioState.group?.find((x)=>x.id==this.props.groupId)?.set?.find((x)=>x.id == this.props.id)?.set)? '#1492E6' : this.props.transparentBorder? 'transparent' : (Colors? (Colors.containerBox == '#FFFFFF'? '#DEDEDE' : '#363636') : 'transparent')
                }]}>
                {!this.props.children && (
                <>
                <View style={{alignSelf:'center',justifyContent:'center',width:this.props.small? undefined : 130,height:this.props.small? 25 : 79,borderBottomWidth:0.5, borderBottomColor:Colors? Colors.dragContainerSeperator : 'transparent'}}>
                    <TextView size={14} opacity={0.7} textAlign={'center'} lineHeight={this.props.small? -28.5 : 11} color={Colors? Colors.titleDark : 'transparent'} fontWeight={'Heavy'}>{this.props.title}</TextView>
                    <TextView size={10} opacity={1} textAlign={'center'} color={Colors? Colors.titleDark : 'transparent'} fontWeight={'Light'}>{this.props.lineOne}</TextView>
                    <TextView size={10} opacity={1} textAlign={'center'} color={Colors? Colors.titleDark : 'transparent'} fontWeight={'Light'}>{this.props.lineTwo}</TextView>
                </View>
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Icon icon={'arrow'} size={10.23} color={(RadioButton.radioState.group?.find((x)=>x.id==this.props.groupId)?.set?.find((x)=>x.id == this.props.id)?.set)? '#1492E6' : '#DEDEDE'}></Icon>
                </View>
                </>
                )}
                {this.props.children}
            </Pressable>
        )
    }
}