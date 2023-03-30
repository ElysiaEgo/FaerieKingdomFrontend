import api from './api'
import { getToken } from './token'

export interface QuestResponse {
  code: number
  quests: Quest[]
}

export interface Quest {
  questId: string
  questPhase: string
}

export const useCurrentUser = async (biliId: string): Promise<QuestResponse> => {
  return await api.post('getQuest', {
    json: {
      biliId,
      token: getToken()
    }
  }).json<QuestResponse>()
}
