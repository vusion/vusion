<template>
    <div>
        <div :class="$style.root"></div>
        <div :class="$style.png"></div>
    </div>
</template>

<style module>
.root {
    width: 50px;
    height: 50px;
    background: url('./assets/compare.png');
}
.png {
    width: 50px;
    height: 50px;
    background: url('./assets/hot.png?sprite');
}
</style>
