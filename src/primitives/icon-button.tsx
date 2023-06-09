import { MouseEventHandler } from 'react';
import icons from './icons.json';

export type IconTypes = keyof typeof icons;

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  type?: IconTypes;
  disabled?: boolean;
};

export function IconButton({ onClick, disabled, type = 'send' }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.0}
        stroke="currentColor"
        style={{ width: 'fit-content', height: 'fit-content' }}
      >
        <path d={icons[type]} />
      </svg>
    </button>
  );
}
