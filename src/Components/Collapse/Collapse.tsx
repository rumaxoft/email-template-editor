import { useState } from 'react'

import { RiArrowRightSLine } from 'react-icons/ri'

import styles from './Collapse.module.css'

import { Button } from '../Button'
export interface CollapseProps {
  content?: React.ReactElement
  children?: React.ReactElement
  style?: React.CSSProperties
  className?: string
  [x: string]: any
}

const Collapse: React.FC<CollapseProps> = ({ content, children, style, className, ...rest }) => {
  const [open, setOpen] = useState(true)
  return (
    <div style={style} className={`${styles.collapse} ${open && styles.collapseOpen} ${className}`} {...rest}>
      <div className={`${styles.button}`}>
        <Button xs onClick={() => setOpen(!open)}>
          <RiArrowRightSLine className={`${styles.buttonIcon} ${open && styles.buttonIconOpen}`} />
        </Button>
      </div>
      <div className={`${styles.line}`}></div>
      <div className={`${styles.collapseTitle}`}>{children}</div>
      <div className={`${styles.collapseContent}`}>{content}</div>
    </div>
  )
}

export { Collapse }
