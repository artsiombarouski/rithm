import { Box, Button, HStack, Text, VStack } from 'native-base';
import {
  ModalDialog,
  ModalDialogContentProps,
  RithmFlatList,
  RithmListRenderItemInfo,
} from '@artsiombarouski/rn-components';
import {
  model,
  ResourceApi,
  ResourceApiResponse,
  ResourceExtendedActions,
  ResourceList,
  ResourceListQuery,
  ResourceModel,
  ResourceModelStore,
  ResourceModelStoreRegister,
  ResourceQuery,
} from '@artsiombarouski/rn-resources';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import {
  Form,
  FormDropDown,
  FormInput,
  useForm,
} from '@artsiombarouski/rn-form';

@model()
class TestModel extends ResourceModel {
  get title() {
    return this.get<string>('title');
  }

  get status() {
    return this.get<string>('status');
  }
}

class TestModelStore extends ResourceModelStore<TestModel> {
  model(attributes?: any): any {
    return TestModel;
  }
}

class TestModelList extends ResourceList<TestModel> {
  constructor(
    readonly api: ResourceApi<TestModel>,
    readonly modelStore: ResourceModelStore<TestModel>,
    readonly permanentQuery: ResourceListQuery = {},
  ) {
    super(api, modelStore, permanentQuery);

    this.modelStore.listenExtendedActions(
      ResourceExtendedActions.ModelCreated,
      (model) => {
        console.log('created', model);
        this.push(model);
      },
    );

    this.modelStore.listenExtendedActions(
      ResourceExtendedActions.ModelUpdated,
      (model) => {
        console.log('updated');
        if (model.status === 'canceled') {
          this.remove(model);
        }
      },
    );

    this.modelStore.listenExtendedActions(
      ResourceExtendedActions.ModelDeleted,
      () => {
        console.log('removed');
      },
    );
  }
}

class DummyApi extends ResourceApi<TestModel> {
  constructor() {
    super('/');
  }

  async post(
    data: Object,
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<TestModel>> {
    return new ResourceApiResponse<TestModel>({
      ...data,
      id: `${uuidv4()}`,
    } as any);
  }

  async postRpc<D = TestModel>(params: {
    url: string;
    data: {};
    query?: ResourceQuery;
    headers?: { [p: string]: any };
  }): Promise<ResourceApiResponse<D>> {
    return new ResourceApiResponse({
      ...params.data,
      id: `${uuidv4()}`,
    } as any);
  }

  async postRest<D = TestModel>(
    path: string,
    data: Object,
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<D>> {
    return new ResourceApiResponse({ ...data, id: `${uuidv4()}` } as any);
  }

  async patch(
    resourceId: any,
    data: {},
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<TestModel>> {
    return new ResourceApiResponse<TestModel>(data as any);
  }

  async patchRpc<D = TestModel>(params: {
    url: string;
    data: {};
    query?: ResourceQuery;
    headers?: { [p: string]: any };
  }): Promise<ResourceApiResponse<D>> {
    return new ResourceApiResponse(params.data as any);
  }

  async patchRest<D = TestModel>(
    resourcePath: any,
    data: {},
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<TestModel>> {
    return new ResourceApiResponse(data as any);
  }

  async destroy(
    resourceId: any,
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<TestModel>> {
    return new ResourceApiResponse({} as any);
  }

  async destroyRpc<D = TestModel>(params: {
    url: string;
    query?: ResourceQuery;
    headers?: { [p: string]: any };
  }): Promise<ResourceApiResponse<D>> {
    return new ResourceApiResponse({} as any);
  }

  async destroyRest(
    resourcePath: any,
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<TestModel>> {
    return new ResourceApiResponse({} as any);
  }
}

const ResourceListPage = observer(() => {
  const [register] = useState(new ResourceModelStoreRegister());
  const [store] = useState(new TestModelStore(new DummyApi(), register));
  const list = useLocalObservable(() => new TestModelList(store.api, store));

  const onEditClicked = (model: TestModel) => {
    const EditForm = (props: ModalDialogContentProps) => {
      const form = useForm({
        defaultValues: {
          title: model.title,
          status: model.status,
        },
      });

      return (
        <Form form={form}>
          <FormInput name={'title'} />
          <FormDropDown
            name={'status'}
            options={[
              { key: 'active', label: 'Active' },
              { key: 'canceled', label: 'Canceled' },
            ]}
          />
          <Button
            onPress={() => {
              model.save({ attributes: form.getValues() }).then((res) => {
                props.onOkClick();
              });
            }}
          >
            Save
          </Button>
        </Form>
      );
    };

    ModalDialog.show({
      content: (props) => <EditForm {...props} />,
      showActions: false,
    });
  };

  const onDeleteClick = (item: TestModel) => {
    item.destroy();
  };

  const renderItem = ({ item }: RithmListRenderItemInfo<TestModel>) => {
    const ItemView = observer(() => {
      return (
        <VStack p={2}>
          <Text>{item.title}</Text>
          <HStack>
            <Button variant={'link'} onPress={() => onEditClicked(item)}>
              Edit
            </Button>
            <Button variant={'link'} onPress={() => onDeleteClick(item)}>
              Delete
            </Button>
          </HStack>
        </VStack>
      );
    });
    return <ItemView />;
  };

  return (
    <Box flex={1}>
      <HStack>
        <Button
          onPress={() => {
            store.create({
              title: `${uuidv4()}`,
              status: 'active',
            });
          }}
        >
          Add item
        </Button>
      </HStack>
      <RithmFlatList
        flex={1}
        renderItem={renderItem}
        data={list.data.slice()}
      />
    </Box>
  );
});

export default ResourceListPage;
