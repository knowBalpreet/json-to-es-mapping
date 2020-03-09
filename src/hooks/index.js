import { useRef, useState, useEffect } from 'react'
import klona from 'klona'

function getLocalStorageValue(key) {
  const val = localStorage.getItem(key)
  if (!val) return null
  try {
    return JSON.parse(val)
  } catch (e) {
    return null
  }
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function usePersistentState(key, defaultState = '') {
  const [state, setState] = useState(getLocalStorageValue(key) || defaultState)

  useEffect(() => {
    setLocalStorage(key, state)
  })

  return [state, setState]
}

function useUndo([state, setState]) {
  const history = useRef([state])
  const [index, setIndex] = useState(0)

  function undo() {
    setIndex(Math.max(0, index - 1))
  }
  function redo() {
    setIndex(Math.min(history.current.length - 1, index + 1))
  }
  function newSetState(nextState) {
    const newState = klona(nextState)
    const nextIndex = index + 1
    // Truncate any future redos.
    history.current = history.current.slice(0, nextIndex)
    history.current.push(newState)
    console.log('history ->', history)
    setIndex(nextIndex)
    setState(newState)
  }

  return [
    klona(history.current[index]),
    newSetState,
    undo,
    redo,
    index > 0,
    index < history.current.length - 1,
    index,
  ]
}

export { useUndo, usePersistentState }
