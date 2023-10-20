export const getUrlParams = () => {
  let queryString = window.location.search
  let urlParams = new URLSearchParams(queryString)
  return urlParams
}