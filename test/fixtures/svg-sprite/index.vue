<template>
    <div>
        <div :class="$style.root"></div>
        <div :class="$style.svg"></div>
    </div>
</template>

<style module>
.root {
    width: 50px;
    height: 50px;
    background: url('./assets/twitter.svg');
}
.svg {
    width: 50px;
    height: 50px;
    background: url('./assets/react.svg?sprite');
}
</style>
