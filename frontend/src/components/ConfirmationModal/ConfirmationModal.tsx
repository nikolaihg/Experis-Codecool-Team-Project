import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'default' | 'destructive';
}

export function ConfirmationModal({
    isOpen,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = 'default'
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                </div>
                <div className={styles.footer}>
                    <button
                        className={`${styles.btn} ${styles.cancel}`}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.btn} ${styles.confirm} ${variant === 'destructive' ? styles.destructive : ''}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
