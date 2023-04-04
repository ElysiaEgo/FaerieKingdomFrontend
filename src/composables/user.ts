import api from './api'
import { getToken } from './token'

export interface ProfileResponse {
  biliAccos: BiliAcco[]
}

export interface BiliAcco {
  id: string
  name: string
  isios: boolean
}

export const useCurrentUser = async (): Promise<ProfileResponse> => {
  return await api.post('profile', {
    json: {
      token: getToken()
    }
  }).json<ProfileResponse>()
}
