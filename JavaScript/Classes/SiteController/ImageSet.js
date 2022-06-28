'use strict';
/**
 * @version 0.42
 */
class ImageSet{
    /**
     * @param {Element} elm 
     * @param {string} src 
     */
    constructor(elm, src){
        this.element = elm;
        this.source = src;
    }
}
/** @type {HTMLImageElement & HTMLElement} */
ImageSet.prototype.element;
/** @type {string} */
ImageSet.prototype.source;


class ImageSets extends Array{}
/**
 * @typedef ImageSetData
 * @property {string} big
 */
/**
 * @typedef dataImageSet
 * @property {ImageSetData} data
 */