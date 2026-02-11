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

/** Full library structure */
export interface Library {
  readonly photographers: {
    readonly [genreName: string]: PhotographerGenre
  }
}
