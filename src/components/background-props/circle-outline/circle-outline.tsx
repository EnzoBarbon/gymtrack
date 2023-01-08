import styles from './circle-outline.module.scss';

interface CircleOutlineProps {
  width: number;
  height: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  unit?: string;
}
export default function CircleOutline(props: CircleOutlineProps) {
  const unit = props.unit ?? 'rem';
  return (
    <div
      className={styles.circle}
      style={{
        width: props.width + unit,
        height: props.height + unit,
        top: props.top + unit,
        bottom: props.bottom + unit,
        right: props.right + unit,
        left: props.left + unit,
      }}
    ></div>
  );
}
