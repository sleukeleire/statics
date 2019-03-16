export default class Forms {

  constructor (options) {
    this.setOptions(options);
  }
  
  setOptions (options) {
    this.opts = $.extend({
      'form_selector': '.js-form',
      'required_selector': '[required]',
      'mail_selector': '.js-mail-validation',
      'error_class': 'has-errored',
      'loading_class': 'is-loading',
      'fixed_header_selector': '.js-header',
      // in milliseconds
      'scroll_duration': 300,
        // in pixels
      'scroll_offset': 10,
    }, options);
  }
  
  init () {
    this.$forms = $(this.opts.form_selector);
    this.$window = $(window);
    
    this.$fixed_header = this.opts.fixed_header_selector ? $(this.opts.fixed_header_selector) : false;
    
    this.bindUIEvents();
  }
  
  bindUIEvents () {
    let me = this;
    
    // submit
    this.$forms.on('submit', function (ev) {
      me.submitHandler($(this), ev);
    });
    
    // blurs
    this.$forms.find(this.opts.required_selector + ', ' + this.opts.mail_selector).on('blur', function () {
      me.inputBlurred($(this));
    });
  }
  
  submitHandler ($form, ev) {
    $form.find('.' + this.opts.error_class).removeClass(this.opts.error_class);
    let requireds_valid = this.areRequiredsValid($form);
    let mails_valid = this.areMailsValid($form);
    
    if (!(requireds_valid && mails_valid)) {
      ev.preventDefault();
      this.scrolltoFirstError($form);
    }
  }
  
  scrollTo ($el) {
    let offset = $el.offset().top;
    
    let header_offset = this.$fixed_header ? this.$fixed_header.outerHeight() : 0;
    
    // check if is in screen
    let top = (offset + $el.outerHeight() - this.$window.scrollTop() - header_offset);
    if (
      top < (this.opts.scroll_offset * 2) ||
      top > window.outerHeight
    ) {
      // if it is, scroll there (minus, offset, minus fixed header)
      $('html, body').stop().animate({
        'scrollTop': offset - this.opts.scroll_offset - header_offset
      }, {
        'duration': this.opts.scroll_duration
      });
    }
  }
  
  scrolltoFirstError ($form) {
    let $first = $form.find('.' + this.opts.error_class).eq(0);
    this.scrollTo($first);
    /* let first_offset = $first.offset().top;
    
    let header_offset = this.$fixed_header ? this.$fixed_header.outerHeight() : 0;
    
    // check if is in screen
    if ((first_offset + $first.outerHeight() - this.$window.scrollTop() - header_offset) < (this.opts.scroll_offset * 2)) {
      // if it is, scroll there (minus, offset, minus fixed header)
      $('html, body').stop().animate({
        'scrollTop': first_offset - this.opts.scroll_offset - header_offset
      }, {
        'duration': this.opts.scroll_duration
      });
    } */
  }
  
  inputBlurred ($input) {
    if ($input.hasClass(this.opts.error_class)) {
      $input.removeClass(this.opts.error_class);
      if ($input.is(this.opts.required_selector)) {
        this.checkRequired($input);
      } else if ($input.is(this.opts.mail_selector)) {
        this.checkMail($input);
      }
    }
  }
  
  areRequiredsValid ($form) {
    let is_valid = true;
    let me = this;
    
    $form.find(me.opts.required_selector).each(function () {
      if (!me.checkRequired($(this))) {
        is_valid = false;
      }
    });
    
    return is_valid;
  }
  
  checkRequired ($input) {
    // trim input:
    let val = this.trimInput($input);
    
    if (val === '') {
      $input.addClass(this.opts.error_class);
      return false;
    }
    
    return true;
  }
  
  areMailsValid ($form) {
    let is_valid = true;
    let me = this;
    
    $form.find(me.opts.mail_selector).each(function () {
      if (!me.checkMail($(this))) {
        is_valid = false;
      }
    });
    
    return is_valid;
  }
  
  checkMail ($input) {
    // trim input:
    let val = this.trimInput($input);
    
    if (!this.isValidMail(val)) {
      $input.addClass(this.opts.error_class);
      return false;
    }
    return true;
  }
  
  isValidMail (str) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!re.test(str);
  }
  
  trimInput ($input) {
    let val = $input.val().trim();
    $input.val(val);
    
    return val;
  }
}
