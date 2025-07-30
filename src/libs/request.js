import axios from 'axios'
import localforage from 'localforage'

export async function request({ url, method, data, params, headers }) {
  try {
    const token = await localforage.getItem('token')
    const finalHeaders = { ...(headers || {}) }

    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`
    }

    console.debug('[API Fetch] Request:', { url, method, data, params, headers: finalHeaders })

    const response = await axios({
      url,
      method,
      data: data || {},
      params: params || {},
      headers: finalHeaders,
      validateStatus: () => true, // 无论 HTTP 状态码是什么，都视为成功响应，不抛出异常
    })

    console.debug('[API Fetch] Response:', url, method, response)

    // 检查响应数据是否为对象格式。如果不是（例如，服务器返回了 HTML 错误页面），
    // 则构造一个统一的错误对象。
    if (typeof response.data !== 'object' || response.data === null) {
      return {
        code: 0,
        msg: `Axios: 服务器响应格式错误，状态码: ${response.status}`,
        ...response.data,
      }
    }

    // 直接返回后端返回的 JSON 数据
    return {
      code: 200,
      msg: 'Axios: 请求成功',
      ...response.data
    }

  } catch (error) {
    // 捕获网络级别或请求设置的错误（例如，无法连接服务器）
    console.error('Request failed:', error)
    return {
      code: 0,
      msg: `Axios: 网络请求失败: ${error.message}`,
      data: error,
    }
  }
}