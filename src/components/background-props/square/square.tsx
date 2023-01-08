import styles from './square.module.scss';
interface SquareProps {
  width: number;
  height: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  unit?: string;
  reverse?: boolean;
}

export default function Square(props: SquareProps) {
  const unit = props.unit ?? 'rem';
  const direction = props.reverse ? 'left' : 'right';
  return (
    <div
      className={styles.square}
      style={{
        width: props.width + unit,
        height: props.height + unit,
        top: props.top + unit,
        bottom: props.bottom + unit,
        right: props.right + unit,
        left: props.left + unit,
        background: ` linear-gradient( to ${direction}, rgb(54, 54, 54) -100%, var(--background-color) 100%`,
      }}
    ></div>
  );
}
