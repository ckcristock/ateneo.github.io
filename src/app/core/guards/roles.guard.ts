import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../services/user.service';
import { Child, MenuInterface, Permission } from '../interfaces/menu';

export const rolesGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const menu = userService.user.menu;
  const item = searchItem(menu, state);
  const show = validatePermissions(item?.permissions);
  if (!show) {
    router.navigate(['/']);
  }
  return show;
};

function searchItem(items: MenuInterface, state: RouterStateSnapshot): Child | null {
  let foundItem: Child | null = null;
  function search(items: MenuInterface | Child[]): void {
    for (const item of items) {
      if (item.child.length > 0) {
        search(item.child);
      } else if (item['link'] === state.url) {
        foundItem = item;
        break;
      }
    }
  }

  search(items);
  return foundItem;
}

function validatePermissions(permissions: Permission[]): boolean {
  return permissions?.some((permission) => permission.name === 'show');
}
