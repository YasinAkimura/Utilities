'use strict';
/**
 * @version 1.2
 */
 class HashtagObject{
    /**
     * @param {string} hashtag 
     * @param {()=>any} callback 
     */
    constructor(hashtag, callback){
        this.hashtag = hashtag;
        this.callback = callback;
    }
}
/** @type {string} */
HashtagObject.prototype.hashtag;
/** @type {()=>any} */
HashtagObject.prototype.callback;
class HashtagObjects extends Array{};
window.hashtagArray = new HashtagObjects();