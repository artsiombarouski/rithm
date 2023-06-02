import {
  Resource,
  ResourceApi,
  ResourceAttributes,
  ResourceModel,
  ResourceModelStore,
  ResourceModelStoreRegister,
} from '../src';

class PostModel extends ResourceModel {
  constructor(
    store: ResourceModelStore<PostModel>,
    attributes: ResourceAttributes,
  ) {
    super(store, attributes, {
      user: {
        store: (register) => register.get(UserModel),
      },
    });
  }

  get title() {
    return this.get<string>('title');
  }

  get user() {
    return this.get<UserModel>('user');
  }
}

class UserModel extends ResourceModel {
  get name() {
    return this.get<string>('name');
  }
}

describe('Resources', function () {
  it('smoke', async () => {
    const storesRegister = new ResourceModelStoreRegister();

    const postResource = new Resource<PostModel>(
      () => PostModel,
      ResourceApi.create('/'),
      {
        storesRegister: storesRegister,
      },
    );
    const userResource = new Resource<UserModel>(
      () => UserModel,
      ResourceApi.create('/'),
      {
        storesRegister: storesRegister,
      },
    );

    const postData = {
      id: `post_${Date.now()}`,
      title: 'test post',
      user: {
        id: `user_${Date.now()}`,
        name: 'test user',
      },
    };

    const postModel = await postResource.store.build(postData);
    expect(postModel.user?.name).toBe('test user');

    // External update of user model
    const userModel = userResource.store.get(postData.user.id)!;
    userModel
      .set({
        name: 'test user (updated)',
      })
      .commitChanges();
    expect(postModel.user?.name).toBe('test user (updated)');

    // Updating same post but with updated user model
    postModel
      .set({
        user: {
          id: postData.user.id,
          name: 'test user (updated 2)',
        },
      })
      .commitChanges();
    expect(userModel?.name).toBe('test user (updated 2)');
    expect(postModel.user?.name).toBe('test user (updated 2)');
  });
});
