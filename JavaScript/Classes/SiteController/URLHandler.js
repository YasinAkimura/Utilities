'use strict';
/**
 * @version 1.2
 */
 class URLHandler{
    /**
     * @param {HashtagObject[]} hashtagObject 
     */
    constructor(){
        this.hashtagArray = window.hashtagArray;
    }
    /**
     * Pushs the hashtag inside hashtagArray if not available
     * @param {HashtagObject} hashtag 
     */
    pushHashtag(hashtag){
        let found = false;
        if(this.hashtagArray.length == 0){
            this.hashtagArray.push(hashtag)
            return;
        }
        for(let i = 0; i < this.hashtagArray.length;i++){
            let hashtagObj = this.hashtagArray[i];
            if(typeof hashtagObj == 'HashtagObject'){
                if(hashtagObj.hashtag == hashtag.hashtag){
                    found = true;
                }
            }
        }
        if(!found) 
            this.hashtagArray.push(hashtag)
    }
    /**
     * 
     * @param {string} hashtagName 
     * @returns {HashtagObject | null}
     */
    searchHashtagObj(hashtagName){
        return this.hashtagArray.find((x)=>x.hashtag == hashtagName);
    }
    /**  
     * @param {Element} page 
     */
    async callbackHandler(page){
        if(this.hashtagArray.length > 0){
            let hashtag = window.location.href.split('#')[1];
            if(!hashtag) return;
            hashtag = hashtag.toLowerCase();
            if(page.getElementById(hashtag)) page.getElementById(hashtag).scrollIntoView({behavior:'smooth'});
            let hashtagObj = this.searchHashtagObj(hashtag);
            if(hashtagObj) hashtagObj.callback();
        }
    }
}
/** @type {HashtagObject[]} */
URLHandler.prototype.hashtagArray;