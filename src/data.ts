import { IMG } from './media'

export type Project = {
  id: string
  no: string
  title: string
  place: string
  year: string
  type: 'Residential' | 'Cultural' | 'Workplace' | 'Interior'
  status: string
  area: string
  blurb: string
  image: string
}

export const PROJECTS: Project[] = [
  {
    id: 'sund',
    no: '01',
    title: 'Sund House',
    place: 'Klampenborg, DK',
    year: '2025',
    type: 'Residential',
    status: 'Completed',
    area: '410 m²',
    blurb:
      'A family house folded around a walled courtyard. Board-formed concrete on the road side, full-height oak glazing to the garden.',
    image: IMG.heroFacade,
  },
  {
    id: 'kalk',
    no: '02',
    title: 'Kalk Gallery',
    place: 'Aarhus, DK',
    year: '2024',
    type: 'Cultural',
    status: 'Completed',
    area: '1,240 m²',
    blurb:
      'Five top-lit rooms for a private collection. Lime plaster walls hold the light; the structure never appears.',
    image: IMG.gridFacade,
  },
  {
    id: 'refs',
    no: '03',
    title: 'Refshale Works',
    place: 'Copenhagen, DK',
    year: '2024',
    type: 'Workplace',
    status: 'Completed',
    area: '2,900 m²',
    blurb:
      'A shipyard hall converted into studios. We added only a timber mezzanine and left every weld visible.',
    image: IMG.lowAngle,
  },
  {
    id: 'vinter',
    no: '04',
    title: 'Vinter Apartment',
    place: 'Oslo, NO',
    year: '2023',
    type: 'Interior',
    status: 'Completed',
    area: '186 m²',
    blurb:
      'A 1930s apartment stripped to its bones, then rebuilt in smoked oak, travertine and unlacquered brass.',
    image: IMG.livingRoom,
  },
  {
    id: 'mark',
    no: '05',
    title: 'Markhus Retreat',
    place: 'Gotland, SE',
    year: '2026',
    type: 'Residential',
    status: 'In construction',
    area: '260 m²',
    blurb:
      'Three limestone volumes set into a meadow, each turned a few degrees to catch a different hour of the day.',
    image: IMG.madrid,
  },
  {
    id: 'nord',
    no: '06',
    title: 'Nord Pavilion',
    place: 'Malmö, SE',
    year: '2026',
    type: 'Cultural',
    status: 'On the boards',
    area: '640 m²',
    blurb:
      'A reading pavilion in a public park — a thin concrete canopy on eight columns, glazed on every side.',
    image: IMG.cloudTower,
  },
]

export type Post = {
  no: string
  title: string
  kicker: string
  date: string
  read: string
  body: string
}

export const POSTS: Post[] = [
  {
    no: '01',
    title: 'On the weight of a wall',
    kicker: 'Essay',
    date: 'Feb 2026',
    read: '6 min',
    body: 'Thickness is not nostalgia. A 400 mm wall changes how a window is made, how sound behaves, and how a room holds warmth long after the heating is off.',
  },
  {
    no: '02',
    title: 'Notes from the Gotland quarry',
    kicker: 'Field note',
    date: 'Jan 2026',
    read: '4 min',
    body: 'Two days choosing limestone with the people who cut it. Every block carries a direction, and the building has to agree with it.',
  },
  {
    no: '03',
    title: 'Why we still build models',
    kicker: 'Process',
    date: 'Nov 2025',
    read: '5 min',
    body: 'A screen flatters everything. A 1:50 model in raking light tells you within a minute whether a massing works or is quietly wrong.',
  },
  {
    no: '04',
    title: 'The quiet cost of daylight',
    kicker: 'Research',
    date: 'Sep 2025',
    read: '8 min',
    body: 'Glazing is the easiest way to make a plan photograph well and the easiest way to make it uninhabitable in August. A study of six openings.',
  },
]
