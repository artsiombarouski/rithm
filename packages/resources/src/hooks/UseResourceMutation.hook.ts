import { ResourceModel } from '../ResourceModel';
import { ResourceModelStore } from '../ResourceModelStore';
import { useEffect, useState } from 'react';
import { ResourceApiError, ResourceQuery } from '../api';

export function useResourceMutation<T extends ResourceModel>(
  primaryKey: any,
  modelStore: ResourceModelStore<T>,
  query?: ResourceQuery,
  initialData?: Object | T,
): { model: T; error?: ResourceApiError } {
  const [error, setError] = useState<ResourceApiError | undefined>();
  const [model] = useState<T>(() => modelStore.mutate(primaryKey, initialData));
  useEffect(() => {
    if (!primaryKey) {
      return;
    }
    model.fetch(query).then((res) => {
      setError(res.error);
    });
  }, []);
  return { model, error };
}
