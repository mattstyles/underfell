
export default [
  {
    id: 'base:wall',
    traits: [
      'core:solid'
    ]
  },
  // Stone floor
  {
    id: 'core:stone_floor',
    traits: [
      'core:noisy_floor'
    ],
    char: '.',
    color: 'rgb(68, 36, 52)'
  },
  // Stone block
  {
    id: 'core:stone_wall',
    extend: [
      'base:wall'
    ],
    traits: [
      'core:mineable'
    ],
    char: '#',
    color: 'rgb(133, 149, 161)'
  },
  // Fancy wall, for testing really, to see if it will extend from two
  // levels, via core:stone_wall, and also apply core:stone_floor
  {
    id: 'fancy:wall',
    extend: [
      'core:stone_wall',
      'core:stone_floor'
    ],
    char: '$'
  }
]
