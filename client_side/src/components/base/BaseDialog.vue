<template>
    <teleport to="body">
        <div v-if="show" @click="tryClose" class="backdrop"></div>
        <dialog open v-if="show">
            <header class="w-100 bg-dark py-2 px-3 text-light">
                <slot name="header"></slot>
            </header>
            <section class="p-5">
                <slot></slot>
            </section>
            <slot name="actions">
                
            </slot>
        </dialog>
    </teleport>
</template>

<script>
export default {
    props: {
        show: {
        type: Boolean,
        required: true,
        }
    },
    emits: ['close'],
    methods: {
        tryClose() {
        if (this.fixed) {
            return;
        }
        this.$emit('close');
        },
    }
};
</script>

<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 10;
}

dialog {
    position: fixed;
    z-index: 100;
    border: none;
    margin: 0;
    padding: 0;
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    overflow: hidden;
    top: 20vh;
    background-color: white;
    width: 60%;
}

@media (min-width: 768px) {
    dialog {
        left: calc(50% - 25rem);
    }
}
</style>