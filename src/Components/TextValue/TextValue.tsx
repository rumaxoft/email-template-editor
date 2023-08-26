import React, { useEffect, useRef, useMemo } from 'react'

import { generateAst } from './helpers/generateAst'
import {
  moveCursorLeft,
  moveCursorRight,
  moveCursorFromValue,
  manageDelete,
  manageBackspace,
} from './helpers/manageCursor'
import styles from './TextValue.module.css'
export interface TextValueProps {
  value?: string
  setTextValue: (value: string, id: number) => void
  resizable?: boolean
  values?: Record<string, string>
  activeTextValueId: number
  currentIndex: number
  setCurrentIndex: (value: number) => void
  setActiveTextValueId: (value: number) => void
  id: number
}

const TextValue: React.FC<TextValueProps> = ({
  value = '',
  setTextValue,
  resizable = false,
  values,
  id,
  activeTextValueId,
  currentIndex,
  setActiveTextValueId,
  setCurrentIndex,
}) => {
  const textarea = useRef<null | HTMLTextAreaElement>(null)
  const resize = (e: React.ChangeEvent<HTMLTextAreaElement> | { target: HTMLTextAreaElement }) => {
    if (e.target) {
      const elem = e.target as HTMLTextAreaElement
      const borders = parseFloat(window.getComputedStyle(elem).borderWidth) * 2
      elem.style.height = '0'
      elem.style.height = elem.scrollHeight + borders + 'px'
    }
  }

  const generateAstMemoized = useMemo(() => {
    return generateAst(value, values)
  }, [value, values])

  useEffect(() => {
    if (textarea.current) {
      if (activeTextValueId === id) {
        textarea.current.selectionStart = currentIndex
        textarea.current.selectionEnd = currentIndex
        resize({ target: textarea.current })
        textarea.current.focus()
      }
    }
  }, [currentIndex, activeTextValueId, id])

  useEffect(() => {
    if (textarea.current) {
      resize({ target: textarea.current })
    }
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value, id)
    if (resizable) {
      resize(e)
    }
    setCurrentIndex(e.target.selectionStart)
  }

  const handleFocus = (e: React.ChangeEvent<HTMLElement>) => {
    if (e.target.dataset.id) {
      setActiveTextValueId(+e.target.dataset.id)
    }
  }

  const clickHandler = (e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const target = e.target as HTMLTextAreaElement
    target.selectionStart = moveCursorFromValue(target.value, values, target.selectionStart)
    setCurrentIndex(target.selectionStart)
  }

  const keydownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    if (e.key === 'ArrowRight') {
      target.selectionStart = moveCursorRight(target.value, values, target.selectionStart)
    } else if (e.key === 'ArrowLeft') {
      target.selectionStart = moveCursorLeft(target.value, values, target.selectionStart)
    } else if (e.key === 'Delete') {
      const [value, cursorIndex] = manageDelete(target.value, values, target.selectionStart)
      if (value !== target.value) {
        e.preventDefault()
        setTextValue(value, id)
        setTimeout(() => {
          target.selectionStart = cursorIndex
          target.selectionEnd = cursorIndex
        }, 0)
      }
    } else if (e.key === 'Backspace') {
      const [value, cursorIndex] = manageBackspace(target.value, values, target.selectionStart)
      if (value !== target.value) {
        e.preventDefault()
        setTextValue(value, id)
        setTimeout(() => {
          target.selectionStart = cursorIndex
          target.selectionEnd = cursorIndex
        }, 0)
      }
    }
    setTimeout(() => {
      setCurrentIndex(target.selectionStart)
    })
  }

  return (
    <div className={`${styles.textareaContainer}`}>
      <textarea
        key={id}
        data-id={id}
        rows={1}
        value={value}
        className={`${styles.textarea} ${styles.textareaBordered}`}
        onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInput(e)}
        onClick={(e) => clickHandler(e)}
        onKeyDown={(e) => keydownHandler(e)}
        onFocus={(e) => handleFocus(e)}
        ref={textarea}
      ></textarea>
      <div className={`${styles.textareaShadow}`}>
        {generateAstMemoized.map((el, index) => {
          if (el.type === 'value') {
            return (
              <React.Fragment key={index + 'fr'}>
                <span key={index + 'lb'} className={styles.valueBracketLeft}>
                  {'{'}
                </span>
                <span key={index} className={styles.value}>
                  {el.value.slice(1, -1)}
                </span>
                <span key={index + 'rb'} className={styles.valueBracketRight}>
                  {'}'}
                </span>
              </React.Fragment>
            )
          } else {
            return (
              <span className={styles.text} key={index}>
                {el.value}
              </span>
            )
          }
        })}
      </div>
    </div>
  )
}

export { TextValue }
