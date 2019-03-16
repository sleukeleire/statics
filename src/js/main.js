// example:

// Utils need no instantiation, it holds only static functions
// import Utils from './classes/Utils';
import BrowserUpgrade from './classes/BrowserUpgrade';
import MobileMenu from './classes/MobileMenu';
import Forms from './classes/Forms';

export default class Main {
  
  constructor () {
    this.createInstances();

    this.initInstances();
  }

  createInstances () {
    this.browser_upgrade = new BrowserUpgrade();
    this.mobile_menu = new MobileMenu();
    this.forms = new Forms();
  }

  initInstances () {
    this.browser_upgrade.init();
    this.mobile_menu.init();
    this.forms.init();
  }
  
}

// document ready event
$(() => new Main());
