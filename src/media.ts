/* Curated architectural photography (Pexels CDN) */

const P = (id: number, w: number, h: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`

export const IMG = {
  heroFacade: P(28506788, 1600, 1000),
  gridFacade: P(17455310, 1400, 1000),
  brownConcrete: P(7482712, 1200, 1500),
  cloudTower: P(20578678, 1200, 1500),
  lowAngle: P(6960364, 1200, 1500),
  madrid: P(35251110, 1200, 1500),
  glassOffice: P(4534504, 1200, 1500),
  concreteWall: P(2191622, 1600, 900),

  woodCeiling: P(7746586, 1000, 1400),
  stoneWindow: P(17084964, 1000, 1400),
  livingRoom:
    'https://images.pexels.com/photos/34017792/pexels-photo-34017792.png?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1400',
  kitchen: P(22743854, 1000, 1400),
  warmVase: P(7404942, 1000, 1400),
  cozyLiving: P(39529309, 1000, 1400),
} as const
