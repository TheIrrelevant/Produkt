import type { Library } from '../types/library'
import data from './library.json'

export function useLibrary(): Library {
  return data as Library
}
