import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { rosterTabs } from '../data/portfolioData';
import { PixelSprite } from './PixelSprite';

describe('PixelSprite', () => {
  it('renders a registered sprite with an accessible label', () => {
    render(<PixelSprite spriteId="amazon" label="Amazoar" animate />);

    expect(screen.getByRole('img', { name: 'Amazoar' })).toBeVisible();
  });

  it('renders a readable placeholder for an unknown sprite', () => {
    render(<PixelSprite spriteId="missing" label="Unknown creature" animate={false} />);

    expect(screen.getByText('Unknown creature')).toBeVisible();
  });

  it('switches to the readable placeholder when a sprite image fails to load', () => {
    const { container } = render(
      <PixelSprite spriteId="amazon" label="Amazoar" animate />,
    );

    fireEvent.error(container.querySelector('img')!);

    expect(screen.getByText('Amazoar')).toBeVisible();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it.each(['constructor', 'toString', '__proto__'])(
    'treats the inherited %s property as an unknown sprite',
    (spriteId) => {
      const { container } = render(
        <PixelSprite spriteId={spriteId} label="Prototype creature" animate />,
      );

      expect(screen.getByText('Prototype creature')).toBeVisible();
      expect(container.querySelector('img')).not.toBeInTheDocument();
      cleanup();
    },
  );

  it('includes the alternate frame only when animation is enabled', () => {
    const { container, rerender } = render(
      <PixelSprite spriteId="amazon" label="Amazoar" animate={false} />,
    );

    expect(container.querySelectorAll('img')).toHaveLength(1);

    rerender(<PixelSprite spriteId="amazon" label="Amazoar" animate />);

    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it.each(['wps-data-lab', 'remetra', 'generex', 'dartbyte'])(
    'resolves the preserved %s sprite without a fallback',
    (spriteId) => {
      const { container } = render(
        <PixelSprite spriteId={spriteId} label={spriteId} animate />,
      );

      expect(screen.getByRole('img', { name: spriteId })).toBeVisible();
      expect(screen.queryByText(spriteId)).not.toBeInTheDocument();
      expect(container.querySelectorAll('img')).toHaveLength(2);
      cleanup();
    },
  );

  it.each([
    'bhangra',
    'sigma-beta-rho',
    'games-collecting',
    'hiking',
    'music',
    'food-explorer',
  ])('renders two animation frames for %s', (spriteId) => {
    render(<PixelSprite spriteId={spriteId} label={spriteId} animate />);

    expect(screen.getByRole('img', { name: spriteId }).querySelectorAll('img')).toHaveLength(2);
    cleanup();
  });

  const entriesWithExistingSprites = rosterTabs
    .flatMap((roster) => roster.entries)
    .filter((entry) => entry.spriteId !== 'wps-data-lab' && entry.spriteId !== 'remetra');

  it.each(entriesWithExistingSprites)(
    'resolves the $spriteId sprite used by $organization',
    (entry) => {
      render(
        <PixelSprite
          spriteId={entry.spriteId}
          label={entry.creatureName}
          animate={false}
        />,
      );

      expect(screen.getByRole('img', { name: entry.creatureName })).toBeVisible();
      expect(screen.queryByText(entry.creatureName)).not.toBeInTheDocument();
      cleanup();
    },
  );
});
