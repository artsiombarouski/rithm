import { service } from '@artsiombarouski/rn-services';

export type Href = string | HrefObject;

export interface HrefObject {
  /** Path representing the selected route `/[id]`. */
  pathname?: string;
  /** Query parameters for the path. */
  params?: Record<string, any>;
}

type Router = {
  /** Navigate to the provided href. */
  push: (href: Href) => void;
  /** Navigate to route without appending to the history. */
  replace: (href: Href) => void;
  /** Go back in the history. */
  back: () => void;
  /** Update the current route query params. */
  setParams: (params?: Record<string, string>) => void;
};

@service()
export class NavigationService {
  private _router!: Router;

  setRouter(router: Router) {
    this._router = router;
  }

  push(path: Href) {
    this._router.push(path);
  }

  replace(path: Href) {
    this._router.replace(path);
  }

  back() {
    this._router.back()
  }
}
