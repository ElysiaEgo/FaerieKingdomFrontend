import api from './api'
import { getToken } from './token'

interface GameAssetsResp {
  code: number
  message: string
  data: string
}

async function useGameAssets<T> (name: string): Promise<T[]> {
  return await api.post(`gameAssets/${name}`, {
    json: {
      token: getToken()
    }
  }).json<GameAssetsResp>().then((value) => {
    if (value.code === 0) {
      return JSON.parse(value.data)
    } else {
      return new Error(value.message)
    }
  }).catch((reason) => {
    return new Error(reason)
  })
}

export interface Item {
  id: number
  name: string
  unit: string
  detail: string
}

export const useItem = async (): Promise<Item[]> => await useGameAssets('Item')

export interface War {
  warid: number
  name: string
}

export const useWar = async (): Promise<War[]> => await useGameAssets('War')

export interface Skill {
  skillId: number
  skillName: string
}

export const useSkill = async (): Promise<Skill[]> => await useGameAssets('Skill')

export interface Servant {
  servantId: number
  servantName: string
}

export const useServant = async (): Promise<Servant[]> => await useGameAssets('Servant')

export interface Spot {
  id: number
  name: string
  warId: number
}

export const useSpot = async (): Promise<Spot[]> => await useGameAssets('Spot')

export interface Quest {
  id: number
  spotId: number
  name: string
  actConsume: number
}

export const useQuest = async (): Promise<Quest[]> => await useGameAssets('Quest')

export interface QuestPhaseDetail {
  questId: number
  phase: number
}

export const useQuestPhaseDetail = async (): Promise<QuestPhaseDetail[]> => await useGameAssets('QuestPhaseDetail')
