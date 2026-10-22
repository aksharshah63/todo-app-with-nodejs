const deleteDialog = document.getElementById('delete-dialog');
const deleteMessage = document.getElementById('delete-dialog-message');
const confirmDeleteButton = document.getElementById('confirm-delete');

let pendingDeleteForm;

document.querySelectorAll('.delete-form button').forEach((button) => {
    button.addEventListener('click', () => {
        pendingDeleteForm = button.closest('form');
        deleteMessage.textContent = `Are you sure you want to delete "${button.dataset.taskTitle}"?`;
        deleteDialog.showModal();
    });
});

confirmDeleteButton.addEventListener('click', () => {
    if (pendingDeleteForm) {
        pendingDeleteForm.requestSubmit();
    }
});

deleteDialog.addEventListener('close', () => {
    pendingDeleteForm = undefined;
});
