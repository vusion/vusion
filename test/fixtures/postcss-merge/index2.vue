<template>
    <div>
        <div :class="$style.root">
            <div :class="$style.child1"></div>
            <div :class="$style.child2"></div>
        </div>
    </div>
</template>

<style module>
@merge './index2.css';
.root {
    height: 150px;
    background: blue;
}
.child1,.child2{
    background: azure;
}
.child2{
    float: left;
}
</style>
