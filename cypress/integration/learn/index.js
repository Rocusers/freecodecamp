/* global cy expect */

const selectors = {
  challengeMap: "[data-test-label='learn-curriculum-map']"
};

const locations = {
  index: '/learn'
};

const superBlockNames = [
  'Responsive Web Design Certification',
  'JavaScript Algorithms and Data Structures Certification',
  'Front End Libraries Certification',
  'Data Visualization Certification',
  'APIs and Microservices Certification',
  'Quality Assurance Certification',
  'Scientific Computing with Python Certification',
  'Data Analysis with Python Certification',
  'Information Security Certification',
  'Machine Learning with Python Certification',
  'Coding Interview Prep (Thousands of hours of challenges)'
];

describe('Learn Landing page (not logged in)', () => {
  it('Should render', () => {
    cy.visit(locations.index);

    cy.title().should('eq', 'Learn to code at home | freeCodeCamp.org');
  });

  it('Has the correct heading for an unauthenticated User', () => {
    cy.visit(locations.index);

    cy.contains('h1', "Welcome to freeCodeCamp's curriculum.");
  });

  it('Should render a curriculum map', () => {
    cy.document().then(document => {
      const superBlocks = document.querySelectorAll(
        `${selectors.challengeMap} > ul > li`
      );
      expect(superBlocks).to.have.length(11);

      superBlocks.forEach((superBlock, idx) => {
        expect(superBlock.innerText).to.have.string(superBlockNames[idx]);
      });
    });
  });
});

describe('Quotes', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains("Get started (it's free)").click({ force: true });
  });

  it('Should show a quote', () => {
    cy.get('blockquote').within(() => {
      cy.get('q').should('be.visible');
    });
  });

  it('Should show quote author', () => {
    cy.get('blockquote').within(() => {
      cy.get('cite').should('be.visible');
    });
  });
});

describe('Superblocks and Blocks', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains("Get started (it's free)").click({ force: true });
  });

  it('Has first superblock and block collapsed by default', () => {
    cy.contains(superBlockNames[0]).should('be.visible');
    cy.contains(superBlockNames[0]).should(
      'have.attr',
      'aria-expanded',
      'true'
    );

    cy.contains('Basic HTML and HTML5').should('be.visible');
    cy.contains('Basic HTML and HTML5').should(
      'have.attr',
      'aria-expanded',
      'true'
    );
  });

  it('Has all supeblocks visible but folded (excluding the first one)', () => {
    cy.contains(superBlockNames[1]).should('be.visible');
    cy.contains(superBlockNames[1]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.contains(superBlockNames[2]).should('be.visible');
    cy.contains(superBlockNames[2]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.contains(superBlockNames[3]).should('be.visible');
    cy.contains(superBlockNames[3]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.contains(superBlockNames[4]).should('be.visible');
    cy.contains(superBlockNames[4]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.contains(superBlockNames[5]).should('be.visible');
    cy.contains(superBlockNames[5]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.contains(superBlockNames[6]).should('be.visible');
    cy.contains(superBlockNames[6]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.contains(superBlockNames[7]).should('be.visible');
    cy.contains(superBlockNames[7]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.contains(superBlockNames[8]).should('be.visible');
    cy.contains(superBlockNames[8]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.contains(superBlockNames[9]).should('be.visible');
    cy.contains(superBlockNames[9]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );

    cy.contains(superBlockNames[10]).should('be.visible');
    cy.contains(superBlockNames[10]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );
  });

  it('Superblocks should be collapsable and foldable', () => {
    cy.contains(superBlockNames[0]).click({
      force: true
    });
    cy.contains(superBlockNames[0]).should(
      'have.attr',
      'aria-expanded',
      'false'
    );
    cy.contains('Basic HTML and HTML5').should('not.be.visible');

    cy.contains(superBlockNames[0]).click({
      force: true
    });
    cy.contains(superBlockNames[0]).should(
      'have.attr',
      'aria-expanded',
      'true'
    );
    cy.contains('Basic HTML and HTML5').should('be.visible');
  });

  it('Blocks should be collapsable and foldable', () => {
    cy.contains('Basic HTML and HTML5').click({ force: true });
    cy.contains('Basic HTML and HTML5').should(
      'have.attr',
      'aria-expanded',
      'false'
    );
    cy.contains('Introduction to Basic HTML and HTML5').should(
      'not.be.visible'
    );

    cy.contains('Basic HTML and HTML5').click({ force: true });
    cy.contains('Basic HTML and HTML5').should(
      'have.attr',
      'aria-expanded',
      'true'
    );
    cy.contains('Introduction to Basic HTML and HTML5').should('be.visible');
  });
});
