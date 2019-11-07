<template>
    <div>
        <div :class="$style.root">
            <div :class="$style.child1"></div>
            <div :class="$style.child2"></div>
        </div>
    </div>
</template>

<style module>
@merge './index1.css';

.root {
    height: 150px;
    background: blue;
}
.child2{
    float: right;
}
.child2{
    background: azure;
}
</style>
