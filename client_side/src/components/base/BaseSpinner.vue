<template>
    <div>
        <teleport to="body">
            <div v-if="show" class="backdrop"></div>
            
            <div v-if="show">
                <slot></slot>
            </div>
        </teleport>
    </div>
    
</template>

<script>
export default {
    props: ['show']
}
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

</style>