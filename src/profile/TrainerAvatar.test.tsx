import { fireEvent, render, screen } from '@testing-library/react';
import { TrainerAvatar } from './TrainerAvatar';

it('renders with stable card-scale dimensions', () => {
  render(<TrainerAvatar src="/trainer-avatar.png" label="Keshav Goel" />);

  expect(screen.getByRole('img', { name: 'Pixel avatar of Keshav Goel' })).toHaveClass(
    'trainer-card__avatar-image',
  );
  expect(screen.getByRole('img', { name: 'Pixel avatar of Keshav Goel' })).toHaveAttribute(
    'width',
    '320',
  );
  expect(screen.getByRole('img', { name: 'Pixel avatar of Keshav Goel' })).toHaveAttribute(
    'height',
    '534',
  );
});

it('replaces a failed trainer image with a labeled fallback', () => {
  render(<TrainerAvatar src="/missing-avatar.png" label="Keshav Goel" />);

  fireEvent.error(screen.getByRole('img', { name: 'Pixel avatar of Keshav Goel' }));

  expect(screen.getByRole('img', { name: 'Keshav Goel avatar unavailable' })).toBeVisible();
  expect(screen.queryByRole('img', { name: 'Pixel avatar of Keshav Goel' })).not.toBeInTheDocument();
});
