import styles from './add-button.module.scss';
interface AddButtonProps {
  action: () => void;
}

export default function AddButton(props: AddButtonProps) {
  return (
    <div className={styles.addButtonContainer}>
      <button className={styles.addButton} onClick={() => props.action()}>
        ADD
      </button>
    </div>
  );
}
