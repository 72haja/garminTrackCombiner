import { describe, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'

import FileList from '../../components/FileList.vue'

const testFile1 = new File(["Foo"], "testFile1", {
  type: "text/xml",
})
const testFile2 = new File(["Foo"], "testFile2", {
  type: "text/xml",
})

const tmpLocalFiles = [
  testFile1,
  testFile2,
]

describe('mount App', () => {
  const vuetify = createVuetify()

  test('mount component', async () => {
    expect(FileList).toBeTruthy()

    const wrapper = mount(FileList, {
      global: {
        plugins: [vuetify]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})


describe('test function', () => {
  const vuetify = createVuetify()
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileList, {
      props: {
        localFiles: tmpLocalFiles,
      },
      global: {
        plugins: [vuetify]
      }
    });
  });

  describe('removeFile', () => {
    test('removeFile', async () => {
      wrapper.vm.removeFile(testFile1)

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('remove-file')).toBeTruthy();
      expect(wrapper.emitted('remove-file')[0]).toEqual([
        testFile1,
      ]);
    })
  })
})

