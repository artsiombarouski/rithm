import { service } from '@artsiombarouski/rn-services';
import { Router } from 'expo-router/build/types';
import { Href } from 'expo-router/build/link/href';

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
    this._router.back();
  }
}
