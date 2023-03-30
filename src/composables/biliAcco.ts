import api from './api'
import { getToken } from './token'

export interface BiliResponse {
  code: number
}

export const usebiliAcco = async (biliname: string, bilipass: string): Promise<BiliResponse> => {
  return await api.post('bili_login', {
    json: {
      biliname,
      bilipass,
      token: getToken()
    }
  }).json<BiliResponse>()
}
