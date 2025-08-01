import localforage from 'localforage'
import { decrypt } from './utils.js'

export async function getLoginInfo () {
  try {
    let info = decrypt(await localforage.getItem('login_info'))
    console.debug('[User Info]', info)

    if (!info.name || !info.idCard || !info.token) {
      return { code: 413 }
    }

    return { code: 200, ...info }

  } catch (e) {
    console.error('catch getLoginInfo error: ', e)
    await localforage.clear()
    return {
      code: 413,
      msg: '检查身份核验状态失败，请尝试重新进行身份核验。',
    }
  }
}