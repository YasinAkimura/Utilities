export default class TextData{
    public static readonly defaultFontFamily: string = "SFProDisplay-";
    public static getFontWeight(weight: string | number | undefined):string {
        var value: string = "Regular";
        if(typeof weight != undefined)
            switch((typeof weight == "string") ? weight.toLowerCase() : weight){
                case (typeof weight == "string") ? "ultralight" : 100:
                    value = "Ultralight";
                break;
                case (typeof weight == "string") ? "thin": 200:
                    value = "Thin";
                break;
                case (typeof weight == "string") ? "light" : 300:
                    value = "Light";
                break;
                case (typeof weight == "string") ? "normal" : 400:
                    value = "Regular";
                break;
                case (typeof weight == "string") ? "medium" : 500:
                    value = "Medium";
                break;
                case (typeof weight == "string") ? "semibold" : 600:
                    value = "Semibold";
                break;
                case (typeof weight == "string") ? "bold" : 700:
                    value = "Bold";
                break;
                case ((typeof weight == "string") ? "heavy" : 800):
                    value = "Heavy";
                break;
                case (typeof weight == "string") ? "black" : 900:
                    value = "Black";
                break;
                default:
                    value = "Regular";
            }
        return value;
    }
}