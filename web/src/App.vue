<template>
  <div class="flex justify-center items-center min-h-screen bg-[#f3e9dc] p-10 relative">
    <div class="w-full h-full container">
      <!-- layout -->
      <img src="./assets/48945.svg" class="absolute top-3 left-3 w-32" alt="Vue logo" />
      <img src="./assets/48945.svg" class="absolute top-3 right-3 w-32 transform rotate-90" alt="Vue logo" />
      <img src="./assets/48945.svg" class="absolute bottom-3 right-3 w-32 transform rotate-180" alt="Vue logo" />
      <img src="./assets/48945.svg" class="absolute bottom-3 left-3 w-32 transform -rotate-90" alt="Vue logo" />

      <h1 className="text-4xl font-semibold absolute top-6 left-1/2 transform -translate-x-1/2 font-kalam text-slate-700">
        Guest Book
      </h1>

    </div>
    <router-view />
  </div>
</template>     
    