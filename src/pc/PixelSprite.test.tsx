import { cleanup, render, screen } from '@testing-library/react';
import { careerBoxes } from '../data/portfolioData';
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

  it('includes the alternate frame only when animation is enabled', () => {
    const { container, rerender } = render(
      <PixelSprite spriteId="amazon" label="Amazoar" animate={false} />,
    );

    expect(container.querySelectorAll('img')).toHaveLength(1);

    rerender(<PixelSprite spriteId="amazon" label="Amazoar" animate />);

    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it.each(careerBoxes.flatMap((box) => box.entries))(
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
