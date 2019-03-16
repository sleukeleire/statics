/**
 * This class ads the useragent as attribute to the html tag. Showing the browser upgrade message should be done with CSS!
 */
export default class BrowserUpgrade {
    init () {
        $('html').attr('data-useragent', navigator.userAgent);
    }
}
