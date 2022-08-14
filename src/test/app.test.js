import { describe } from 'vitest'
import { mount } from '@vue/test-utils'

import vuetify, { createVuetify } from 'vuetify'

import App from '../App.vue'

describe('mount App', () => {
  const vuetify = createVuetify()

  test('mount component', async () => {
    expect(App).toBeTruthy()

    const wrapper = mount(App, {
      global: {
        plugins: [vuetify]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('test imports', () => {
  const components = [
    'Header',
    'FileCombiner',
  ]

  components.forEach(component => {
    test('dynamic imports as expected', async () => {

      const cmp = await import(`../components/${component}.vue`)
      expect(cmp).toBeDefined()
    })
  })
});


