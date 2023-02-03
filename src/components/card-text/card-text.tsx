import styles from './card-text.module.scss';
interface CardTextProps {
  text: string;
}

export default function CardText(props: CardTextProps) {
  return (
    <div className={styles.container}>
      <span className={styles.text}>{props.text}</span>
    </div>
  );
}
