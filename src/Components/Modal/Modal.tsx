import { KeyboardEvent, useRef, useCallback, MouseEvent, useState, cloneElement } from 'react'
import { createPortal } from 'react-dom'
import { RiCloseLine } from 'react-icons/ri'

import styles from './Modal.module.css'

import { Button } from '../Button'

export interface ModalProps {
  buttonText?: string
  buttonContent?: React.ReactElement
  headerContent?: React.ReactElement
  children?: React.ReactElement
  renderChildren?: (closeModal: () => void) => JSX.Element
  header?: string
  style?: React.CSSProperties
}

const Modal: React.FC<ModalProps> = ({
  buttonText,
  buttonContent,
  headerContent,
  style,
  children,
  renderChildren,
  header,
}) => {
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const modalWrapper = useRef<HTMLDivElement | null>(null)
  const modalRefCallback = useCallback((node: HTMLDivElement) => {
    node?.focus()
    document.body.style.setProperty('overflow', 'hidden')
    if (modalRef.current) {
      document.body.style.removeProperty('overflow')
    }
    modalRef.current = node
  }, [])

  const handleEscKeydown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      animatedClose()
    }
  }

  const animatedClose = () => {
    if (modalWrapper.current) {
      modalWrapper.current.classList.add(styles.removing)
    }
    setTimeout(() => {
      setShowModal(false)
    }, 200)
  }

  const closeModalByBackdrop = (e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      animatedClose()
    }
  }

  return (
    <>
      {buttonText && <Button onClick={() => setShowModal(true)}>{buttonText}</Button>}
      {buttonContent && cloneElement(buttonContent, { onClick: () => setShowModal(true) })}
      {showModal &&
        createPortal(
          <div ref={modalWrapper} style={style} className={styles.backdrop} onClick={closeModalByBackdrop}>
            <div className={styles.centered}>
              <div ref={modalRefCallback} tabIndex={0} onKeyDown={handleEscKeydown} className={styles.modal}>
                <div className={styles.modalHeader}>
                  {header ? <h5 className={styles.heading}>{header}</h5> : headerContent}
                </div>
                <button className={styles.closeBtn} onClick={animatedClose}>
                  <RiCloseLine style={{ marginBottom: '-3px' }} />
                </button>
                <div className={styles.modalContent}>
                  {children ? children : renderChildren && renderChildren(animatedClose)}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

export { Modal }
