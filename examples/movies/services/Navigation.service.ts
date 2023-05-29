import { service } from '@rithm/rn-core';
import { Href } from 'expo-router/src/link/href';

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
  private _router: Router;

  setRouter(router: Router) {
    this._router = router;
  }

  navigate(path: string) {
    this._router.push(path);
  }
}
