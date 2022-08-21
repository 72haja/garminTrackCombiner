import { describe, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'

import testFile1 from '../../../public/mocks/testFile1.tcx?raw'
import testFile2 from '../../../public/mocks/testFile2.tcx?raw'

import FileUploader from '../../components/FileUploader.vue'

describe('mount App', () => {
  const vuetify = createVuetify()

  test('mount component', async () => {
    expect(FileUploader).toBeTruthy()

    const wrapper = mount(FileUploader, {
      global: {
        plugins: [vuetify]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('test computed', () => {
  const vuetify = createVuetify()
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileUploader, {
      global: {
        plugins: [vuetify]
      }
    });
  });

  describe('fileLength', () => {
    test('fileLength - 0', async () => {
      wrapper.vm.files = null

      expect(wrapper.vm.fileLength).toBe(0)
    })

    test('errorMessageLength - 1 - exists', async () => {
      const testFile =
        new File(["Foo"], "testFile1", {
          type: "text/xml",
        })

      wrapper.vm.files = [
        testFile
      ]

      expect(wrapper.vm.fileLength).toBe(1)
    })
  });
})

describe('test function', () => {
  const vuetify = createVuetify()
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileUploader, {
      global: {
        plugins: [vuetify]
      }
    });
  });

  describe('emitFilesChanged', () => {
    test('emitFilesChanged', async () => {
      const testFile =
        new File(["Foo"], "testFile1", {
          type: "text/xml",
        })

      wrapper.vm.files = [
        testFile
      ]

      wrapper.vm.emitFilesChanged()

      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('files-changed')).toBeTruthy();
      expect(wrapper.emitted('files-changed')[0]).toEqual([[
        testFile,
      ]]);
    })

    test('emitFilesChanged - no files', async () => {
      wrapper.vm.files = null

      wrapper.vm.emitFilesChanged()

      expect(wrapper.emitted('files-changed')).toBeTruthy();
      expect(wrapper.emitted('files-changed')[0]).toEqual([[]]);
    })
  })

  describe('removeFile', () => {
    it('removeFile', async () => {
      wrapper.vm.files = [
        new File(["Foo"], "testFile1", {
          type: "text/xml",
        }),
        new File([testFile2], "testFile2", {
          type: "text/xml",
        }),
      ]

      wrapper.vm.removeFile(wrapper.vm.files[0].name)

      expect(wrapper.vm.files).toEqual([
        new File([testFile2], "testFile2", {
          type: "text/xml",
        }),
      ])
    })

    it('removeFile - no files', async () => {
      wrapper.vm.files = null

      wrapper.vm.removeFile("not existing file name")

      expect(wrapper.vm.files).toEqual([])
    })
  });
})

