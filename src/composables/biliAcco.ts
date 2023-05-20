import api from './api'
import { getToken } from './token'

export interface BiliResponse {
  code: number
}

export const usebiliAcco = async (biliname: string, bilipass: string, isios: boolean): Promise<BiliResponse> => {
  return await api.post('biliLogin', {
    json: {
      biliname,
      bilipass,
      isios,
      token: getToken()
    }
  }).json<BiliResponse>()
}
