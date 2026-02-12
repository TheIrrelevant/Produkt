/** Single photographer profile */
export interface Photographer {
  readonly style: string
  readonly lighting: string
  readonly vibe: string
}

/** Genre → Photographer name → Profile */
export interface PhotographerGenre {
  readonly [photographerName: string]: Photographer
}

/** Single analysis dimension (one row in the 4x4 matrix) */
export interface AnalysisCategory {
  readonly label: string
  readonly dimensions: readonly string[]
}

/** Product type with its 4-category analysis template */
export interface ProductType {
  readonly label: string
  readonly analysisTemplate: readonly AnalysisCategory[]
}

/** Full library structure */
export interface Library {
  readonly photographers: {
    readonly [genreName: string]: PhotographerGenre
  }
  readonly productTypes: {
    readonly [typeId: string]: ProductType
  }
}
