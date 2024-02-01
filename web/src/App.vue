

<template>
  <div style="height: calc(100vh - 4rem)">
    <router-view />
  </div>

  <nav class="h-16 w-full flex justify-center items-center space-x-3">
    <router-link to="/">Home</router-link>
    <router-link to="/create">Create</router-link>
  </nav>
</template>     
    