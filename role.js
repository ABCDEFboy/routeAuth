/**
 * @description 验证用户路由
 * @param {Route} to 跳转的路由
 * @param {number} role 用户角色
 * @param {Function} next vue-router导航中的next方法
 * @param {Location} errorRoute 错误跳转路由
 *
 **/
export const routeAuth = (
  to, // Route
  role, // number
  next, // Function
  errorRoute // RawLocation
) => {
  if (to.matched.some((record) => record.meta.auth)) {
    // 这里确保在父路由写的auth也能匹配到
    let { auth } = to.meta;
    if (!auth) {
      // 是父路由统一的验证
      auth = to.matched.find((item) => item.meta.auth)?.meta.auth;
    }
    if (auth) {
      if (typeof auth === 'number') {
        // 使用单个数字，表示只要大于这个数就有权限
        if (role >= auth) {
          next();
          return;
        }
        next(errorRoute);
      } else {
        // 数组，包含role表示通过
        if (~auth.indexOf(role)) {
          next();
          return;
        }
        next(errorRoute);
      }
    } else {
      next();
    }
  } else {
    next();
  }
};
