import { fireEvent, render, screen } from '@testing-library/react';
import { TrainerWalkScene } from './TrainerWalkScene';

const renderScene = () =>
  render(
    <TrainerWalkScene
      trainerSrc="/trainer-walk.png"
      label="Keshav walking"
    />,
  );

it('renders the walking scene with stable layer classes', () => {
  renderScene();

  expect(screen.getByRole('img', { name: 'Keshav walking' })).toHaveClass(
    'trainer-walk-scene',
  );
  expect(screen.getByTestId('trainer-walk-strip').parentElement).toHaveClass(
    'trainer-walk-trainer',
  );
  expect(screen.getByTestId('trainer-walk-strip')).toHaveClass('trainer-walk-strip');
  expect(screen.getByTestId('trainer-walk-strip')).toHaveAttribute('src', '/trainer-walk.png');
  expect(screen.queryByTestId('trainer-companion')).not.toBeInTheDocument();
});

it('replaces the scene when the trainer source fails', () => {
  renderScene();

  fireEvent.error(screen.getByTestId('trainer-walk-strip'));

  expect(screen.getByRole('img', { name: 'Keshav walking unavailable' })).toBeVisible();
  expect(screen.queryByTestId('trainer-walk-strip')).not.toBeInTheDocument();
});
