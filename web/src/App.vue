<template>
  <div
    class="flex justify-center items-center min-h-screen bg-[url('./assets/paper_background.png')] relative"
  >
    <div class="w-full h-full container">
      <h1
        className="text-5xl lg:text-7xl whitespace-pre absolute pt-6 lg:pt-12 top-0 left-1/2 transform -translate-x-1/2 font-great-vibes text-[#DEDCCE]"
      >
        Guest Book
      </h1>
    </div>
    <router-view />
  </div>
</template>
