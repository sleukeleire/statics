export default class Utils {
  
    static stringEscapeRegExp (str) {
        return str.replace('/([.*+?^=!:${}()|\[\]\/\\\])/g', "\\\$1");
    }

    static stringReplaceAll (find, replace, str) {
        return str.replace(new RegExp(this.escapeRegExp(str), 'g'), replace);
    }

    static disableBodyScroll () {
        // making sure the scroll keeps the same:
        let current_scrolltop = $(window).scrollTop();
        
        $('body').css({
            'position': 'fixed',
            'width': '100%',
            'overflow-y': 'scroll',
            'top': -current_scrolltop + 'px'
        });
    }
    
    static enableBodyScroll () {
        let $body = $('body');
        // restore scroll
        let current_scrolltop = -parseInt($body.css('top'), 10);
        
        $body.css({
            'position': '',
            'width': '',
            'overflow-y': '',
            'top': ''
        });
        
        $(window).scrollTop(current_scrolltop);
    }
}
