import indexHtml from '../../index.html?raw';

it('uses the pixel trainer portrait as the site favicon', () => {
  expect(indexHtml).toContain(
    '<link rel="icon" type="image/png" href="/favicon.png" />',
  );
});
