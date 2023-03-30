import api from './api'
import { getToken } from './token'

export interface NewOrerResponse {
  code: number
}

export interface OrderResponse {
  code: number
  orders: Order[]
}

export interface Order {
  biliId: string
  finish: boolean
  message: string
  num: number
  questId: number
  questPhase: number
}

export const useOrder = async (): Promise<OrderResponse> => {
  return await api.post('query', {
    json: {
      token: getToken()
    }
  }).json<OrderResponse>()
}

export const newOrder = async (questId: number, questPhase: number, num: number, biliId: string): Promise<NewOrerResponse> => {
  return await api.post('order', {
    json: {
      questId,
      questPhase,
      num,
      biliId,
      token: getToken()
    }
  }).json<NewOrerResponse>()
}
