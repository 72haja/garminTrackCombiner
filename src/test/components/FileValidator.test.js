import { describe, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'

import testFile1 from '../../../public/mocks/testFile1.tcx?raw'
import testFile2 from '../../../public/mocks/testFile2.tcx?raw'

import FileValidator from '../../components/FileValidator.vue'
import { nextTick } from 'vue'

function getXmlDoc (content) {
  const parser = new DOMParser();
  return parser.parseFromString(content, "text/xml");
}

const testFile1Xml = getXmlDoc(testFile1)
const testFile2Xml = getXmlDoc(testFile2)

describe('mount App', () => {
  const vuetify = createVuetify()

  test('mount component', async () => {
    expect(FileValidator).toBeTruthy()

    const wrapper = mount(FileValidator, {
      props: {
        files: [
          {
            name: "testFile1Xml",
            content: testFile1Xml,
          },
          {
            name: "testFile2Xml",
            content: testFile2Xml,
          },
        ],
      },
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
    wrapper = shallowMount(FileValidator, {
      props: {
        files: [
          {
            name: "testFile1Xml",
            content: testFile1Xml,
          },
          {
            name: "testFile2Xml",
            content: testFile2Xml,
          },
        ],
      },
      global: {
        plugins: [vuetify]
      }
    });
  });

  describe('errorMessageLength', () => {
    test('errorMessageLength - 0 - does not exist', async () => {
      wrapper.vm.errorMessage = null

      expect(wrapper.vm.errorMessageLength).toBe(0)
    })

    test('errorMessageLength - 1 - exists', async () => {
      wrapper.vm.errorMessage = "error"

      expect(wrapper.vm.errorMessageLength).toBeGreaterThan(0)
    })
  });
})

describe('test function', () => {
  const vuetify = createVuetify()
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileValidator, {
      props: {
        files: [
          {
            name: "testFile1Xml",
            content: testFile1Xml,
          },
          {
            name: "testFile2Xml",
            content: testFile2Xml,
          },
        ],
      },
      global: {
        plugins: [vuetify]
      }
    });
  });

  describe('getFileActivityTypes', () => {
    test('getFileActivityTypes - activity types', async () => {
      wrapper.vm.getFileActivityTypes()

      await nextTick()

      expect(
        wrapper.vm.fileActivityTypes
      ).toEqual([
        {
          name: "testFile1Xml",
          sportType: "Biking",
        },
        {
          name: "testFile2Xml",
          sportType: "Biking",
        }
      ])
    })

    test('getFileActivityTypes - no activity types', async () => {
      await wrapper.setProps({
        files: null
      });

      wrapper.vm.getFileActivityTypes()

      await nextTick()

      expect(
        wrapper.vm.fileActivityTypes
      ).toEqual([])
    })
  })

  describe('checkIfAllDocsHaveSameActivity', () => {
    test('checkIfAllDocsHaveSameActivity - truthy', async () => {
      wrapper.vm.checkIfAllDocsHaveSameActivity()
      
      await nextTick()
      
      expect(wrapper.emitted('error-exists')).toBeTruthy();
      expect(wrapper.emitted('error-exists')).toContainEqual([false]);
      expect(wrapper.emitted('error-exists')).not.toContainEqual([true]);
    })
    
    test('checkIfAllDocsHaveSameActivity - falsy', async () => {
      wrapper.vm.fileActivityTypes = [
        {
          name: "testFile1Xml",
          sportType: "Biking",
        },
        {
          name: "testFile2Xml",
          sportType: "Running",
        }
      ]
      
      wrapper.vm.checkIfAllDocsHaveSameActivity()
      
      await nextTick()
      
      expect(wrapper.emitted('error-exists')).toBeTruthy();
      expect(wrapper.emitted('error-exists')).toContainEqual([false]);
      expect(wrapper.emitted('error-exists')).toContainEqual([true]);
    })
  })
})

