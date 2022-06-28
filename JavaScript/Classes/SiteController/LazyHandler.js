'use strict';
/**
 * @version 0.4
 */
 class LazyHandler{
    /**
    * @constructor sets the data to work on
    * @param {string} lazyClass - the name of the class which LazyHandler looks for
    * @param {string} lazyData - the name of the data-attribute without the prefix data-
    */
    constructor(lazyClass, lazyData){
        try{ 
            if(typeof lazyClass != 'string' || typeof lazyData != 'string') 
                throw new Error("Typeof arguments must be a string!"+
                                "\nlazyClass: "+(typeof lazyClass)+
                                "\nlazyData: "+typeof lazyData);
            this.lazyData = lazyData ? lazyData : '';
            this.lazyClass = lazyClass ? lazyClass : '';
        } catch (e){
            if(this.debug) console.error(e)
        }
    }
    /** @param {Element} dom */
    setLazyElements(dom){
        let page = dom ? dom : document;
        this.lazyElements = page.getElementsByClassName(this.lazyClass);
        if(this.debug) console.log("firstcount:", this.lazyElements.length)
    }
    /**
     * @param {ImageSetData} src 
     * @param {Element} elm 
     */
    preLoadImage(src, elm){
        try{
            if(typeof src != 'object' || typeof elm != 'object') 
                throw new Error("Typeof arguments must be of object, object!"+
                                "\nsrc: "+(typeof src)+
                                "\nelm: "+typeof elm);
            let output = new Image();
            output.addEventListener('load',(e)=>{
                this.imageSet.push(new ImageSet(elm, src.big));
                if(this.debug) console.log("loaded: ",src.big);
            });
            output.src = src.big;

        } catch(e){
            if(this.debug) console.error(e);
        }
    }
    doLazyHandling(){
        try{ 
        if(this.lazyElements && this.lazyElements.length > 0)
            for(let i=0; i < this.lazyElements.length; i++){
                let elm = this.lazyElements[i];
                /** @type {dataImageSet} elmData */
                let elmData = JSON.parse(elm.getAttribute("data-"+this.lazyData));
                this.preLoadImage(elmData.data, elm);
            }
            let theSeed = setInterval(/** @param {Event} e */(e)=>{
                this.intervalCount++;
                if(this.debug)console.log("elements",this.lazyElements,e)
                if(this.debug)console.log("count: ",this.lazyElements.length,this.imageSet.length);
                // if(this.lazyElements.length == this.imageSet.length){
                    clearInterval(theSeed);
                    if(this.debug) console.log(this.imageSet)

                    for(let i=0; i < this.imageSet.length; i++){
                        let set = this.imageSet[i];
                        set.element.classList.add('loaded');
                        switch(set.element.nodeName){
                            case "IMAGE":
                                set.element.src = set.source;
                            break;
                            default:
                                set.element.style.backgroundImage = "url("+set.source+")";
                        }
                    }
                // }
                if(this.intervalCount > 50) {
                    clearInterval(theSeed);
                    if(this.debug)console.log("Interval died after 50s please debug");
                    if(this.debug)console.log("elements",this.lazyElements,e)
                    if(this.debug)console.log("count: ",this.lazyElements.length,this.imageSet.length);
                }
            }, 1000);
        } catch(e){
            if(this.debug) console.error(e)
        }
    }
}
/** @type {boolean} */
LazyHandler.prototype.debug = window.THEME_DEVMODE.settings.debug;
/** @type {HTMLCollectionOf<Element>} */
LazyHandler.prototype.lazyElements = null;
/** @type {ImageSet[]} */
LazyHandler.prototype.imageSet = new ImageSets();
/** @type {string} */
LazyHandler.prototype.lazyData = null;
/** @type {string} */
LazyHandler.prototype.lazyClass = null;
/** @type {number} */
LazyHandler.prototype.intervalCount = 0;