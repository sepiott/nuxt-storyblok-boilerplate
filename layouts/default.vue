<template>
  <div class="min-h-screen flex flex-col">
    <StickyContainer>
      <Banner />
      <Header />
    </StickyContainer>

    <main class="flex-grow">
      <NuxtPage />
    </main>

    <Footer />
  </div>
</template>
