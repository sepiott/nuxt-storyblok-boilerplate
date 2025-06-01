<template>
  <!-- ========== FOOTER ========== -->
  <div class="bg-white">
    <div class="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <div class="pt-5 mt-5 border-t border-gray-200">
        <div class="sm:flex sm:justify-between sm:items-center">
          <div class="flex flex-wrap items-center gap-3">
            <div class="space-x-4 text-sm">
              <BaseLink
                v-for="link in footerLinks.links"
                :key="link.id"
                class="inline-flex gap-x-2 text-action hover:text-secondary focus:outline-hidden focus:text-secondary"
                :href="link.slug"
              >
                {{ link.name }}
              </BaseLink>
            </div>
          </div>

          <div class="flex flex-wrap justify-between items-center gap-3">
            <!-- Social Brands -->
            <div class="space-x-4">
              <BaseLink
                class="inline-block text-action hover:text-secondary focus:outline-hidden focus:text-secondary"
                href="#"
              >
                <svg
                  class="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4.5 0A4.5 4.5 0 000 4.5v7A4.5 4.5 0 004.5 16h7a4.5 4.5 0 004.5-4.5v-7A4.5 4.5 0 0011.5 0h-7zM8 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm4.5-1.5a1 1 0 110 2 1 1 0 010-2z"
                  />
                </svg>
              </BaseLink>
              <BaseLink
                class="inline-block text-action hover:text-secondary focus:outline-hidden focus:text-secondary"
                href="#"
              >
                <svg
                  class="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
                  />
                </svg>
              </BaseLink>
              <BaseLink
                class="inline-block text-action hover:text-secondary focus:outline-hidden focus:text-secondary"
                href="#"
              >
                <svg
                  class="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"
                  />
                </svg>
              </BaseLink>
              <BaseLink
                class="inline-block text-action hover:text-secondary focus:outline-hidden focus:text-secondary"
                href="#"
              >
                <svg
                  class="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"
                  />
                </svg>
              </BaseLink>
              <BaseLink
                class="inline-block text-action hover:text-secondary focus:outline-hidden focus:text-secondary"
                href="#"
              >
                <svg
                  class="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8.6 1.6c0-.3 0-.6.1-.9h2.3c.1.6.4 1.2.8 1.6.4.4 1 .7 1.6.8v2.3c-.8 0-1.5-.2-2.2-.6-.3-.2-.6-.4-.8-.6V9.6c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.4 0 .8.1 1.2.2v2.4c-.4-.2-.8-.3-1.2-.3-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V1.6z"
                  />
                </svg>
              </BaseLink>
            </div>
            <!-- End Social Brands -->
          </div>
          <!-- End Col -->
        </div>
        <p class="mt-3 text-xs sm:text-sm text-gray-800">
          © {{ currentYear }} [ YOUR NAME ] – All rights reserved
        </p>
      </div>
    </div>
  </div>
  <!-- ========== END FOOTER ========== -->
</template>

<script setup lang="ts">
const currentYear = useCurrentYear()
const footerLinks = await useFooterLinks()
</script>
