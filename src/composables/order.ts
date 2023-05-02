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
  message: string | null
  num: number
  questId: number
  questPhase: number
}

export const useOrder = async (): Promise<OrderResponse> => {
  return await api.post('queryOrder', {
    json: {
      token: getToken()
    }
  }).json<OrderResponse>()
}

export const newOrder = async (questId: number, questPhase: number, num: number, biliId: string, useApple: boolean[]): Promise<NewOrerResponse> => {
  return await api.post('newOrder', {
    json: {
      questId,
      questPhase,
      num,
      useApple,
      biliId,
      token: getToken()
    }
  }).json<NewOrerResponse>()
}
