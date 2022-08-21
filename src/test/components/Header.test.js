import { describe } from 'vitest'
import { mount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'

import Header from '../../components/Header.vue'

describe('mount App', () => {
  const vuetify = createVuetify()

  test('mount component', async () => {
    expect(Header).toBeTruthy()

    const wrapper = mount(Header, {
      global: {
        plugins: [vuetify]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
