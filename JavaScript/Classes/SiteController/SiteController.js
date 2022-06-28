'use strict';
var loopCount = 0;
/**
 * @version 0.75
 */
class SiteController{
    /**
     * @param {Document | HTMLElement} dom 
     */
    constructor(dom){
        this.domElement = dom ? dom : document;
        this.initNavigationHandler();
        this.initHashtagCallbacks();
    }
    /**
     * @param {Document | HTMLElement } dom 
     */
    initPages(dom){
        let page = dom ? dom : this.domElement;
        this.pages = page.querySelectorAll(!this.isTab? '[data-page]' : '[data-tab]');
    }
    initHashtagCallbacks(){
        if(this.domElement == document) return;
        let hashtagElements = this.domElement.querySelectorAll('[data-hashtag]');
        for(let i = 0; i < hashtagElements.length; i++){
            let hashtagPageObj = hashtagElements[i];
            let hashtag = hashtagPageObj.getAttribute('data-hashtag').split('#')[1].toLowerCase();
            /** @param {Element | Document} page */
            let callbackFnc = (page)=>{
                new EditorialController(document,true).openEditorial(hashtag);
                this.checkPageThenLoad(page);
            };
            let hashtagObj = new HashtagObject(hashtag, callbackFnc.bind(this,hashtagPageObj));
            new URLHandler().pushHashtag(hashtagObj);
        }
    }
    initNavigationHandler(){
        this.navItems = this.domElement.querySelectorAll('[data-nav]');
        this.initController();
        this.navItems = this.domElement.querySelectorAll('[data-navTab]');
        this.initController();
    }
    /**
     * @param {Event} ev 
     * @param {Element} item 
     */
    async navEvent(ev,item){
        ev.preventDefault();
        item.classList.toggle('active');
        this.unsubscribeActive(item);
        this.isTab = item.hasAttribute("data-navtab");
        this.pageName = item.getAttribute(!this.isTab? 'data-nav' : 'data-navTab');
        this.initPages();
        await this.showPage();
        this.changeURL();
    }
    /**
     * @param {Element} item 
     */
    unsubscribeActive(currentItem){
        for(let i=0;i < this.navItems.length; i++){
            let item = this.navItems[i];
            if(item != currentItem){
                if(item.hasAttribute('data-editorial-item') && !currentItem.hasAttribute('data-editorial-item')){
                    item.classList.remove('active');
                    let editorialItems = item.parentNode.querySelectorAll('[data-editorial-item]');
                    for(let j=0; j < 2; j++){
                        let nextSibling = editorialItems[j == 1 ? 0 : 1];
                        nextSibling.classList.remove('hide-editorial');
                    }
                }
            }
        }
    }
    initController(){
        for(let i=0;i < this.navItems.length; i++){
            let item = this.navItems[i];
            if(item.getAttribute("data-nav-initialized") == 1) return;
            if(item.hasAttribute('data-navTab') && item.getAttribute('data-navTab').length == 0) return;
            if(item.hasAttribute('data-nav') && item.getAttribute('data-nav').length == 0) return;
            item.setAttribute("data-nav-initialized",1);
            item.addEventListener("click", async (ev)=>{
                await this.navEvent(ev,item);
            });
        }
    }
    /** @param {string | null} pageName */
    async showPage(pageName){
        /** @type {Element} */
        let currentPage = null, isLoading = false;
        this.pageName = (pageName)? pageName : this.pageName;
        if(this.pages)
            for(let i=0; i < this.pages.length; i++){
                let page = this.pages[i];
                if(page.getAttribute(this.isTab? "data-tab" : "data-page") == this.pageName){
                    currentPage = this.currentPage = page;
                    this.foundPage = true;
                    let tempIsLoading = await this.checkPageThenLoad(currentPage);
                    isLoading = isLoading? isLoading : tempIsLoading;
                }
                loopCount++;
            }
        if(!this.foundPage) {
            this.foundPage = true;
            this.initPages(document);
            this.showPage(pageName);
            return;
        } else if(!this.foundPage){
            return;
        }
        if(!isLoading) this.hidePageExcept(this.pageName)
        if(this.debug) console.log("showPage.loopCount",loopCount)
        loopCount = 0;
        this.foundPage = false;
    }
    /**
     * 
     * @param {Element} currentPage 
     * @returns {Promise<boolean>} true if page gets side loaded
     */
    async checkPageThenLoad(currentPage){  
        let isLoading = false;           
        if(currentPage.getAttribute("data-loaded") == 0){
            currentPage.setAttribute("data-loaded", 1);
            isLoading = true;
            await this.loadPage(currentPage);
        } else {
            if(this.isTab && !currentPage.hasAttribute('data-toggle-terminator')) 
                currentPage.classList.toggle("hidden");
            else currentPage.classList.remove("hidden");
        }
        return isLoading;
    }
    /** 
     * except pageName 
     * @param {string} pageName
    */
    hidePageExcept(pageName){
        if(this.pages)
        for(let i=0; i < this.pages.length; i++){
            let page = this.pages[i];
            if(page.getAttribute(this.isTab? "data-tab" : "data-page") != pageName){
                if(this.isTab && page.hasAttribute("data-tab")) page.classList.add("hidden");
                if(!this.isTab) page.classList.add("hidden");
            } 
            loopCount++;
        }
        if(this.hideCallback) this.hideCallback(pageName);
    }
    /** @param {Element} page */
    async loadPage(page){
        try{
            let pageName = page.hasAttribute('data-tab')? page.getAttribute('data-tab') : page.getAttribute('data-page');
            let response = await this.getPage(page);
            page.innerHTML = await response.text();
            if(page.hasChildNodes()){
                page.classList.remove("hidden");
                initSiteFunction(page);
                this.isTab = page.hasAttribute('data-tab');
                this.hidePageExcept(pageName);
                if(this.debug) console.log("loadPage.loopCount",loopCount)
                loopCount = 0;
            }
        } catch(e){
            console.log(e)
        }
    }
    /** 
     * @param {Element} page 
     */
    async getPage(page, callback){
        let url = page.getAttribute("data-url")+"?only_page";
        if(url.length > 0){
            /** @type {RequestInit} */
            let initObj = {
                method: 'GET',
                headers: new Headers().append('Content-Type', 'text/html')
            };
            return await fetch(url,initObj);
        }
    }
    changeURL(){
        if(!this.currentPage) return;
        let pageURL = this.currentPage.hasAttribute('data-hashtag')? this.currentPage.getAttribute("data-hashtag") : this.currentPage.getAttribute("data-url");
        let title = this.pageName.substring(0,1).toUpperCase()+this.pageName.substring(1) + " |" + document.title.split("|")[1];
        if (typeof (history.pushState) != "undefined") {
            let obj = { Page: title, Url: pageURL };
            history.pushState(obj, obj.Page, obj.Url);
            document.title = title;
            if(this.currentPage.hasAttribute('data-hashtag')){
                let hashtagElm = document.getElementById(this.currentPage.getAttribute("data-hashtag").split('#')[1]);
                if (navigator.userAgent.indexOf("Android") != -1 || (navigator.userAgent.indexOf("like Mac") != -1)){
                    if(hashtagElm) hashtagElm.scrollIntoView({behavior:'smooth'});
                }
            } else if(this.currentPage.hasAttribute('data-page'))
                this.currentPage.scrollIntoView({behavior:'smooth',block:'start',inline:'start'});
        } else {
            console.error("Browser does not support HTML5.");
        }
    }
}
/** @type {Document | HTMLElement} */
SiteController.prototype.domElement = null;
/** @type {NodeListOf<Element>} */
SiteController.prototype.pages = null;
/** @type {NodeListOf<Element>} */
SiteController.prototype.navItems = null;
/** @type {(openPageName:string)=>void} */
SiteController.prototype.hideCallback = null;
/** @type {()=>void} */
SiteController.prototype.showCallback = null;
/** @type {Element} */
SiteController.prototype.currentPage = null;
/** @type {boolean} */
SiteController.prototype.isTab = null;
/** @type {boolean} */
SiteController.prototype.foundPage = false;
/** @type {string} */
SiteController.prototype.pageName = "";
/** @type {boolean} */
SiteController.prototype.debug = window.THEME_DEVMODE.settings.debug;