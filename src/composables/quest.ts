import api from './api'
import { getToken } from './token'

export interface QuestResponse {
  code: number
  quests: Quest[]
}

export interface Quest {
  questId: string
  questPhase: string
  challengeNum: string
}

export const useQuest = async (biliId: string): Promise<QuestResponse> => {
  return await api.post('getQuest', {
    json: {
      biliId,
      token: getToken()
    }
  }).json<QuestResponse>()
}
