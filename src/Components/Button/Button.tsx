import styles from './Button.module.css'
export interface ButtonProps {
  level?: 'primary' | 'secondary' | 'error' | 'neutral'
  lg?: boolean
  sm?: boolean
  xs?: boolean
  outline?: boolean
  text?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button: React.FC<ButtonProps> = ({
  text = 'some text',
  level,
  outline,
  lg,
  sm,
  xs,
  children,
  style,
  ...rest
}) => {
  return (
    <button
      style={style}
      className={`${styles.btn} 
    ${level ? styles[level] : ''}
    ${lg ? styles.lg : ''}
    ${sm ? styles.sm : ''}
    ${xs ? styles.xs : ''}
    ${outline ? styles.outline : ''}
    `}
      {...rest}
    >
      {children}
    </button>
  )
}

export { Button }
