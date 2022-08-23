import { describe, expect, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'

import { createVuetify } from 'vuetify'

import testFile1 from '../../../public/mocks/testFile1.tcx?raw'
import testFile2 from '../../../public/mocks/testFile2.tcx?raw'

import FileCombiner from '../../components/FileCombiner.vue'

function getXmlDoc(file) {
  const parser = new DOMParser();
  return parser.parseFromString(file, 'text/xml');
}

const testFileParsed1 = new File([testFile1], 'testFile1', { type: 'text/xml' })
const testFileParsed2 = new File([testFile2], 'testFile2', { type: 'text/xml' })

const testFile1Xml = getXmlDoc(testFile1)
const testFile2Xml = getXmlDoc(testFile2)

describe('mount App', () => {
  const vuetify = createVuetify()

  test('mount component', async () => {
    expect(FileCombiner).toBeTruthy()

    const wrapper = mount(FileCombiner, {
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
    wrapper = shallowMount(FileCombiner, {
      global: {
        plugins: [vuetify]
      }
    });
  });

  describe('localFilesAreLessThan2', () => {
    test('localFilesAreLessThan2 - false', async () => {
      wrapper.vm.localFiles = [
        {
          name: 'testFile1',
          content: testFile1Xml,
        },
        {
          name: 'testFile2',
          content: testFile2Xml,
        }
      ]

      expect(wrapper.vm.localFilesAreLessThan2).toBeFalsy()
    })

    test('localFilesAreLessThan2 - true', async () => {
      wrapper.vm.localFiles = []

      expect(wrapper.vm.localFilesAreLessThan2).toBeTruthy()
    })
  });
})

describe('test function', () => {
  const vuetify = createVuetify()
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(FileCombiner, {
      global: {
        plugins: [vuetify]
      }
    });
  });

  describe('updateLocalFiles', () => {
    test('updateLocalFiles', async () => {
      wrapper.vm.updateLocalFiles([
        testFileParsed1,
        testFileParsed2,
      ])

      await wrapper.vm.$nextTick();

      console.log('🚀 ~ file: FileCombiner.test.js ~ line 96 ~ test ~ wrapper.vm.localFiles', wrapper.vm.localFiles);
      expect(wrapper.vm.localFiles).toEqual([
        {
          name: 'testFile1',
          content: testFile1Xml,
        },
        {
          name: 'testFile2',
          content: testFile2Xml,
        }
      ])
    })
  });
})

