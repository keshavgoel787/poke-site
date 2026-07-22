import { fireEvent, render, screen } from '@testing-library/react';
import { TrainerAvatar } from './TrainerAvatar';

it('replaces a failed trainer image with a labeled fallback', () => {
  render(<TrainerAvatar src="/missing-avatar.png" label="Keshav Goel" />);

  fireEvent.error(screen.getByRole('img', { name: 'Pixel avatar of Keshav Goel' }));

  expect(screen.getByRole('img', { name: 'Keshav Goel avatar unavailable' })).toBeVisible();
  expect(screen.queryByRole('img', { name: 'Pixel avatar of Keshav Goel' })).not.toBeInTheDocument();
});
