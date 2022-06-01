/* global describe, it, cy */

describe('base65536 in the browser', () => {
  it('works', () => {
    cy.visit('http://localhost:3000/server/index.html')
    cy.contains('what the heck is up')
  })
})
