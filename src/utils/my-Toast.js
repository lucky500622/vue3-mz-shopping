// 封装一个统一的showToast
export const myShowToast = (message, duration) => {
  return showToast({
    className: 'myShowToast',
    message,
    duration,
    style: {
      padding: '5.33vw',
      top: '69.33vw',
      height: '6vw',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 0 2.66vw 0.26vw rgba(0, 0, 0, 0.2)'
    }
  })
}

// 封装一个统一的showLoadingToast
export const myShowLoadingToast = () => {
  return showLoadingToast({
    className: 'myShowLoadingToast',
    message: 'loading...',
    forbidClick: true,
    duration: 0,
    style: {
      backgroundColor: 'rgba(138, 138, 138, 0.5)'
    }
  })
}

// 封装一个统一的showConfirmDialog，注意要传router route
export const myTologinConfirmToast = (message, yes, no, router, route) => {
  return showConfirmDialog({
    className: 'myTologinConfirmToast',
    message: message,
    confirmButtonText: yes,
    cancelButtonText: no
  })
    .then(() => {
      // on confirm
      router.replace({
        path: '/login',
        query: {
          backUrl: route.fullPath
        }
      })
    })
    .catch(() => {
      // on cancel
    })
}
