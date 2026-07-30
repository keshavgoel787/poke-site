import { fireEvent, render, screen } from '@testing-library/react';
import { TrainerWalkScene } from './TrainerWalkScene';

const renderScene = () =>
  render(
    <TrainerWalkScene
      trainerSrc="/trainer-walk.png"
      companionSrc="/gengar-walk.svg"
      label="Keshav walking with Gengar"
    />,
  );

it('renders the walking scene with stable layer classes', () => {
  renderScene();

  expect(screen.getByRole('img', { name: 'Keshav walking with Gengar' })).toHaveClass(
    'trainer-walk-scene',
  );
  expect(screen.getByTestId('trainer-walk-strip').parentElement).toHaveClass(
    'trainer-walk-trainer',
  );
  expect(screen.getByTestId('trainer-walk-strip')).toHaveClass('trainer-walk-strip');
  expect(screen.getByTestId('trainer-companion').parentElement).toHaveClass(
    'trainer-walk-companion-frame',
  );
  expect(screen.getByTestId('trainer-companion')).toHaveClass(
    'trainer-walk-companion-strip',
  );
  expect(screen.getByTestId('trainer-walk-strip')).toHaveAttribute('src', '/trainer-walk.png');
  expect(screen.getByTestId('trainer-companion')).toHaveAttribute(
    'src',
    '/gengar-walk.svg',
  );
});

it.each(['trainer-walk-strip', 'trainer-companion'])(
  'replaces the entire scene when the %s source fails',
  (sourceTestId) => {
    renderScene();

    fireEvent.error(screen.getByTestId(sourceTestId));

    expect(
      screen.getByRole('img', { name: 'Keshav walking with Gengar unavailable' }),
    ).toBeVisible();
    expect(screen.queryByTestId('trainer-walk-strip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('trainer-companion')).not.toBeInTheDocument();
  },
);
