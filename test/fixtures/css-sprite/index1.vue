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
    background: url('./assets/rank.png?sprite=icon');
}
.png {
    width: 50px;
    height: 50px;
    background: url('./assets/schema.png?sprite=icon');
}
</style>
