/* global describe, it, cy */

describe('base65536 IIFE', () => {
  it('works', () => {
    cy.visit('http://localhost:3000/test-built/index.html')
    cy.contains('what the heck is up')
  })
})
