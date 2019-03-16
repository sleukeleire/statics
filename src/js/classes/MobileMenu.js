import Utils from './Utils';

export default class MobileMenu {
  
  constructor (options) {
    this.setOptions(options);
  }
  
  setOptions (options) {
    this.opts = $.extend({
      'link_selector': '.js-mobile-link',
      'checkbox_selecter': '.js-mobile-menu-checkbox',
      'wrapper_selector': '.js-mobile-menu-wrapper'
    }, options);
  }
  
  init () {
    let me = this;
    
    // enable disable body scroll:
    $(me.opts.checkbox_selecter).on('change', function () {
      if ($(this).is(':checked')) {
        Utils.disableBodyScroll();
      } else {
        Utils.enableBodyScroll();
      }
    });
    
    // close menu on link click
    $(me.opts.link_selector).on('click', function () {
      $(this).closest(me.opts.wrapper_selector).find(me.opts.checkbox_selecter).prop('checked', false).trigger('change');
    });
  }
}
