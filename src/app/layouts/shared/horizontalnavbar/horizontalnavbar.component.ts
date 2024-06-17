import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

import { EventService } from '../../../core/services/event.service';
import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { MenuInterface } from 'src/app/core/interfaces/menu';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-horizontalnavbar',
  templateUrl: './horizontalnavbar.component.html',
  styleUrls: ['./horizontalnavbar.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive, NgStyle],
})
export class HorizontalnavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('subMenu') subMenu: any;
  configData;
  menuItems = [];
  navItems: MenuInterface;
  public innerWidth: any;
  // tslint:disable-next-line: max-line-length
  constructor(
    private router: Router,
    private eventService: EventService,
    private userService: UserService,
    private el: ElementRef,
  ) {
    this.navItems = userService.user.menu;
    //console.log(this.navItems)
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activateMenu();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.initialize();
    this.innerWidth = window.innerWidth;
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3,
    };
  }

  /**
   * On menu click
   */
  onMenuClick(event: any) {
    const nextEl = event.target.nextSibling;
    const parent = event.target.parentNode;

    if (this.innerWidth < 990) {
      if (event.target.nextSibling.id != 'navmenu') {
        let p = event.target.nextSibling.style.display;
        if (p == null || p == '' || p == 'none') {
          event.target.nextSibling.style.display = 'block';
          //event.target.parentElement.style.display = 'block'
          event.target.parentElement.parentElement.style.display = 'block';
        } else {
          event.target.nextSibling.style.display = 'none';
        }
      } else {
        if (event.target.nextSibling.style.display == 'block') {
          event.target.nextSibling.style.display = 'none';
        } else {
          event.target.nextSibling.style.display = 'block';
        }
      }
    } else if (nextEl.id !== 'navmenu') {
      console.log(parent);
    } else if (nextEl && nextEl.classList.contains('show')) {
      const parentEl = event.target.parentNode;
      if (parentEl) {
        parentEl.classList.remove('show');
      }
      nextEl.classList.toggle('show');
    }
    return false;

    /* console.log(event)
     */
  }

  ngAfterViewInit() {
    this.activateMenu();
  }

  hideMenu() {
    document.getElementsByClassName('collapse navbar-collapse')[0].classList.remove('show');
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Togglemenu bar
   */
  toggleMenubar() {
    const element = document.getElementById('topnav-menu-content');
    element.classList.toggle('show');
  }

  /**
   * Activates the menu
   */
  private activateMenu() {
    const resetParent = (el: any) => {
      const parent = el.parentElement;
      if (parent) {
        parent.classList.remove('active');
        const parent2 = parent.parentElement;
        this._removeAllClass('mm-active');
        this._removeAllClass('mm-show');
        if (parent2) {
          parent2.classList.remove('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.remove('active');
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove('active');
              }
            }
          }
        }
      }
    };

    // activate menu item based on location
    const links = document.getElementsByClassName('side-nav-link-ref');
    let matchingMenuItem = null;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // reset menu
      resetParent(links[i]);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
      if (location.pathname === links[i]['pathname']) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      const parent = matchingMenuItem.parentElement;
      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add('active');
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.add('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.add('active');
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.add('active');
              }
            }
          }
        }
      }
    }
  }

  /**
   * Topbar light
   */
  topbarLight() {
    document.body.setAttribute('data-topbar', 'light');
    document.body.removeAttribute('data-layout-size');
  }

  /**
   * Set boxed width
   */
  boxedWidth() {
    document.body.setAttribute('data-layout-size', 'boxed');
    document.body.setAttribute('data-topbar', 'dark');
  }

  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }

  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = MENU;
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item) {
    return item.child !== undefined ? item.child.length > 0 : false;
  }
}
