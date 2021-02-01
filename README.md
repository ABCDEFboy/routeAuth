# 关于路由验证

## 如何使用

路由验证部分的代码已经抽离，各自页面中，只需引入 `routeAuth` 方法，放于路由守卫中即可。代码如下：

`router/index.ts`：

```Javascript

import { routeAuth } from './routeAuth';

  ...

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Index,
    // 在路由中写入原信息
    meta: {
      auth: 13
    }
  },
]
  ...

// 权限
router.beforeEach((to, from, next) => {
  // 用户角色代码，为数组时表示权限只限数组内数字，为number时，表示大于等于该数字都有权限
  const role = store.getters['user/role'];
  // 权限不足页面
  const errorRoute = {
    name: 'errorPage'
  };
  routeAuth(to, role, next, errorRoute);
});

export default router;

```

## 关于路由原信息的内容

路由中规定 `auth` 字段用于路由验证，可以为`number`或者`number[]`。

```Javascript
meta: {
  auth: 11 // 11 | [11,12]
},

```

当`auth`为数组时表示权限只限数组内数字，为 number 时，表示大于等于该数字都有权限。

## 关于`role`

此字段表示用户身份，详细如下

- 0 用户1 
- 1 用户2
- 2 用户3

## 关于父子路由验证

当多个子路由都需要验证时，可以在父路由中统一写验证，`routeAuth` 会统一找 `to.matched`中有验证的路由规则。当子路由没有设定时，会以父路由为主，当父子路由都有设置时，会以子路由为主。

```javascript
{
  path: '/test',
  // name: 'test',
  component: test,
  /**
   * @description
   *  权限设定，父路由可以统一设置
   *  当子路由没有设定时，以父路由的设置为主
   *  当子路由设置时，以子路由为主
   */
  meta: {
    auth: 1
  },
  children: [
    {
      path: 'child',
      name: 'child',
      component: child
      // 此路由会用 `auth:2` 来验证。
      meta: {
        auth: 2
      }
    },
    {
      // 此路由会用 `auth:1` 来验证。
      path: 'other',
      name: 'other',
      component: other
    },
    ...
  ]
}
```
