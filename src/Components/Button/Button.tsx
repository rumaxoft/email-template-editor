import styles from './Button.module.css'
export interface ButtonProps {
  level?: 'primary' | 'secondary' | 'error' | 'neutral'
  lg?: boolean
  sm?: boolean
  xs?: boolean
  text?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ text = 'some text', level, lg, sm, xs, children, style, ...rest }) => {
  return (
    <button
      style={style}
      className={`${styles.btn} 
    ${level ? styles[level] : ''}
    ${lg ? styles.lg : ''}
    ${sm ? styles.sm : ''}
    ${xs ? styles.xs : ''}
    `}
      {...rest}
    >
      {children}
    </button>
  )
}

export { Button }
