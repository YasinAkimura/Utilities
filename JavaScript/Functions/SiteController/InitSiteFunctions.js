'use strict';
var navigatorStack = null;
var windowEventSet = false;
/**
 * Initializes the functions essential for the Site to work
 * @param {Element?} dom page or document
 * @version 0.1
 */
 async function initSiteFunction(dom){
    //Initialize DOM Variables
    let pageDom = document.getElementById("could_be_body_id");
    let page = (dom)? dom : document;
    // START OF LazyHandler //
    let handler = new LazyHandler("lazyLoading","imageSet");
    handler.setLazyElements(page);
    handler.doLazyHandling();
    // END OF LazyHandler //

    // START OF SiteController //
    /** @type {SiteController} */
    let pager = null;
    pager = new SiteController(page);
    if(!windowEventSet & !dom){
        windowEventSet = true;
        navigatorStack = pager;
        window.onpopstate = ()=>{ 
            let page = window.location.pathname.split('/')[1];
            if(!page || page == '') page = 'home';
            navigatorStack.showPage(page);
            // console.log(page,navigatorStack)
        };
    }
    if(!dom) pager = new SiteController(pageDom);
    // END OF SiteController //

    if(!dom) await new URLHandler().callbackHandler(page);

}
document.addEventListener("DOMContentLoaded", async function(){
    await initSiteFunction();
});
