import { describe, expect, it } from 'vitest'
import { defaultState } from '../src/data/defaultState'
import { loadState, saveState, STORAGE_KEY, type StorageLike } from '../src/data/storage'

function memoryStorage(): StorageLike & { value: string | null } {
  return { value: null, getItem() { return this.value }, setItem(_key, value) { this.value = value } }
}

describe('local storage service', () => {
  it('lưu và khôi phục state', () => {
    const storage = memoryStorage()
    const state = { ...structuredClone(defaultState), settings: { ...defaultState.settings, displayName: 'An' } }
    expect(saveState(storage, state)).toBe(true)
    expect(storage.value).toContain('An')
    expect(loadState(storage).settings.displayName).toBe('An')
  })

  it('phục hồi mặc định khi JSON hỏng', () => {
    const storage: StorageLike = { getItem: (key) => key === STORAGE_KEY ? '{bad json' : null, setItem: () => undefined }
    expect(loadState(storage)).toEqual(defaultState)
  })

  it('chuẩn hóa dữ liệu cũ để mỗi môn chỉ còn một điểm hiệu lực', () => {
    const storage = memoryStorage()
    storage.value = JSON.stringify({
      ...defaultState,
      gradeExpectations: [
        { courseId: 'a', expectedScore: 9, gradePoint: 4 },
        { courseId: 'a', expectedScore: 7, gradePoint: 3 },
      ],
    })

    expect(loadState(storage).gradeExpectations).toEqual([{ courseId: 'a', expectedScore: 7, gradePoint: 3 }])
  })
})
