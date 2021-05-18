
import router from '../router'
import store from '../store'

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  const hasToken = store.getters.hasToken
  // console.log('router before Each:', to, from, hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      next({ name: 'home' })
    } else {
      const hasRole = true
      if (hasRole) {
        next()
      } else {
        //todo handle router
      }
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
  }
  next()
})