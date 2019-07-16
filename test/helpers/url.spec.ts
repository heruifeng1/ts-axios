import { buildURL } from '../../src/helpers/url'

describe('buildURL', () => {
  it('should support no params', () => {
    expect(buildURL('/base/get')).toBe('/base/get')
  })
  it('should filte null or undefined as input', () => {
    expect(buildURL('/base/get', { baz: null })).toBe('/base/get')
    expect(buildURL('/base/get', { baz: undefined })).toBe('/base/get')
  })
  it('should accept part params is null or undefined', () => {
    expect(buildURL('/base/get', { foo: 'bar', baz: null })).toBe('/base/get?foo=bar')
  })
  it('should support subject as input', () => {
    expect(buildURL('/base/get', { foo: { bar: 'baz' } })).toBe(
      '/base/get?foo=' + encodeURI('{"bar":"baz"}')
    )
  })
  it('should support date object params', () => {
    const date = new Date()
    expect(buildURL('/foo', { date })).toBe(`/foo?date=${date.toISOString()}`)
  })
  it('should support array parmas', () => {
    expect(
      buildURL('/foo', {
        foo: ['bar', 'baz']
      })
    ).toBe('/foo?foo[]=bar&foo[]=baz')
  })
  it('should support special char params ', () => {
    expect(
      buildURL('/foo', {
        foo: '@:$, '
      })
    ).toBe('/foo?foo=@:$,+')
  })
  it('should support existing params', () => {
    expect(
      buildURL('/foo?foo=bar', {
        bar: 'baz'
      })
    ).toBe('/foo?foo=bar&bar=baz')
  })
  it('should support correctly discard url hash mark', () => {
    expect(
      buildURL('/foo?foo=bar#hash', {
        query: 'baz'
      })
    ).toBe('/foo?foo=bar&query=baz')
  })
  //   xit('should use seializer if provided', () => {
  //     const serializer = jest.fn(() => {
  //         return 'foo=bar'
  //       })
  //       const params = { foo: 'bar' }
  //       expect(buildURL('/foo', params, serializer)).toBe('/foo?foo=bar')
  //       expect(serializer).toHaveBeenCalled()
  //       expect(serializer).toHaveBeenCalledWith(params)
  //   });
  //   it('should support URLSearchParams', () => {
  //     expect(buildURL('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
  //   });
})
