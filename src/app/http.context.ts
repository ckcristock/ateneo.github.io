import { HttpContext, HttpContextToken } from '@angular/common/http';

export const NO_CONTENT_TYPE_NO_ACCEPT = new HttpContextToken<boolean>(() => false);

export function skipContentType() {
  return new HttpContext().set(NO_CONTENT_TYPE_NO_ACCEPT, true);
}
