import indexHtml from '../../index.html?raw';

it('uses the pixel trainer portrait as the site favicon', () => {
  expect(indexHtml).toContain(
    '<link rel="icon" type="image/png" href="/favicon.png" />',
  );
});

it('publishes the trainer-card social preview metadata', () => {
  expect(indexHtml).toContain('<meta property="og:type" content="website" />');
  expect(indexHtml).toContain('<meta property="og:url" content="https://keshavgoel.dev/" />');
  expect(indexHtml).toContain(
    '<meta property="og:image" content="https://keshavgoel.dev/portfolio-preview.png" />',
  );
  expect(indexHtml).toContain('<meta name="twitter:card" content="summary_large_image" />');
  expect(indexHtml).toContain(
    '<meta name="twitter:image" content="https://keshavgoel.dev/portfolio-preview.png" />',
  );
});
