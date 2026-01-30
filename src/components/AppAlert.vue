<template>
<div class="toast-container position-fixed top-0 end-50 p-3">
    <div id="liveToast" class="toast align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
        <div class="toast-body">
            Hello, world! This is a toast message.
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
const showToasts = () => {
  const toastLiveExample = document.getElementById('liveToast');

  if (!toastLiveExample) return;

  // Con TS:
  const bs = (window as any).bootstrap;
  const toast = new bs.Toast(toastLiveExample);

  toast.show();
};
</script>

<style scoped>

</style>