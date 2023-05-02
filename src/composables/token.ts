import { useRouter } from 'vue-router'
import api from './api'

interface TokenResponse {
  code: number
  userid: number
  token: string
  expires: number
}

const router = useRouter()

export const getToken = (): string => {
  const token = localStorage.getItem('token')
  if (token == null) {
    void router.replace({ name: 'login' })
    throw new Error('token not found')
  }
  return token
}

export const useToken = async (uname: string, passwd: string): Promise<TokenResponse> => {
  return await api.post('login', {
    json: {
      uname,
      passwd
    }
  }).json<TokenResponse>().then((value) => {
    localStorage.setItem('token', value.token)
    localStorage.setItem('expiresAt', (value.expires + new Date().getTime()).toString())
    return value
  })
}

export const useReg = async (uname: string, passwd: string): Promise<TokenResponse | undefined> => {
  return await api.post('reg', {
    json: {
      uname,
      passwd
    }
  }).json().then(async (value: any) => {
    if (value.code === 0) {
      return await useToken(uname, passwd)
    } else {
      return value
    }
  })
}
