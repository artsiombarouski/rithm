import axios, { Axios } from 'axios';
import { ResourceApiTransformer } from './ResourceApiTransformer';
import { ResourceApiDefaultTransformer } from './ResourceApiDefaultTransform';

export type ResourceApiConfig = {
  transport: Axios;
  transformer: ResourceApiTransformer;
};

export const defaultResourceApiConfig: ResourceApiConfig = {
  transport: axios.create(),
  transformer: new ResourceApiDefaultTransformer(),
};
