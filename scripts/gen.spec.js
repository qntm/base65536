/* eslint-env jest */

import gen from './gen'

describe('gen', () => {
  let generated

  beforeAll(() =>
    gen().then(g => {
      generated = g
    })
  )

  it('generates the correct padding block', () => {
    expect(generated.paddingBlockStart).toBe('ᔀ')
  })

  it('generates the correct blocks', () => {
    expect(generated.blockStarts).toBe(
      '㐀㔀㘀㜀㠀㤀㨀㬀㰀㴀㸀㼀䀀䄀䈀䌀' +
      '䐀䔀䘀䜀䠀䤀䨀䬀䰀一伀倀儀刀匀吀' +
      '唀嘀圀堀夀娀嬀尀崀帀开怀愀戀挀搀' +
      '攀昀最栀椀樀欀氀洀渀漀瀀焀爀猀琀' +
      '甀瘀眀砀礀稀笀簀紀縀缀耀脀舀茀萀' +
      '蔀蘀蜀蠀褀言謀谀贀踀輀退鄀鈀錀鐀' +
      '销阀需頀餀騀鬀鰀鴀鸀ꄀꈀꌀꔀ𐘀𒀀' +
      '𒄀𒈀𓀀𓄀𓈀𓌀𔐀𔔀𖠀𖤀𠀀𠄀𠈀𠌀𠐀𠔀' +
      '𠘀𠜀𠠀𠤀𠨀𠬀𠰀𠴀𠸀𠼀𡀀𡄀𡈀𡌀𡐀𡔀' +
      '𡘀𡜀𡠀𡤀𡨀𡬀𡰀𡴀𡸀𡼀𢀀𢄀𢈀𢌀𢐀𢔀' +
      '𢘀𢜀𢠀𢤀𢨀𢬀𢰀𢴀𢸀𢼀𣀀𣄀𣈀𣌀𣐀𣔀' +
      '𣘀𣜀𣠀𣤀𣨀𣬀𣰀𣴀𣸀𣼀𤀀𤄀𤈀𤌀𤐀𤔀' +
      '𤘀𤜀𤠀𤤀𤨀𤬀𤰀𤴀𤸀𤼀𥀀𥄀𥈀𥌀𥐀𥔀' +
      '𥘀𥜀𥠀𥤀𥨀𥬀𥰀𥴀𥸀𥼀𦀀𦄀𦈀𦌀𦐀𦔀' +
      '𦘀𦜀𦠀𦤀𦨀𦬀𦰀𦴀𦸀𦼀𧀀𧄀𧈀𧌀𧐀𧔀' +
      '𧘀𧜀𧠀𧤀𧨀𧬀𧰀𧴀𧸀𧼀𨀀𨄀𨈀𨌀𨐀𨔀'
    )
  })

  it('has the right East_Asian_Width properties', () => {
    // All 256 characters in each block have the same East_Asian_Width property.
    // 243 of the blocks are 'W' (wide), the other 13 + 1 are 'N' (neutral,
    // which in effect is narrow). This is significant when considering
    // rendering and wrapping.
    const allBlockStarts = [...generated.blockStarts].map(x => x.codePointAt(0))
    const neutralBlockStarts = [...'ᔀꔀ𐘀𒀀𒄀𒈀𓀀𓄀𓈀𓌀𔐀𔔀𖠀𖤀'].map(x => x.codePointAt(0))
    allBlockStarts.forEach(blockStart => {
      for (let i = 0; i < 1 << 8; i++) {
        const codePoint = blockStart + i
        const isInNeutralBlock = neutralBlockStarts
          .some(neutralBlockStart =>
            neutralBlockStart <= codePoint &&
            codePoint < neutralBlockStart + (1 << 8)
          )
        expect(generated.safeCodePoint.eastAsianWidth(codePoint)).toBe(isInNeutralBlock ? 'N' : 'W')
      }
    })
  })
})
