import './ConfirmationModal.css';

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
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <p className="modal-description">{description}</p>
                </div>
                <div className="modal-footer">
                    <button 
                        className="modal-btn modal-btn-cancel" 
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className={`modal-btn modal-btn-confirm ${variant}`} 
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
