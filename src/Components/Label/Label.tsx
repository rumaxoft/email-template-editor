import styles from './Label.module.css'
export interface LabelProps {
  level?: 'primary' | 'secondary' | 'error' | 'neutral'
  lg?: boolean
  sm?: boolean
  xs?: boolean
  text?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}

const Label: React.FC<LabelProps> = ({ text, level, lg, sm, xs, children, style, ...rest }) => {
  return (
    <span
      style={style}
      className={`${styles.label} 
    ${level ? styles[level] : ''}
    ${lg ? styles.lg : ''}
    ${sm ? styles.sm : ''}
    ${xs ? styles.xs : ''}
    `}
      {...rest}
    >
      {children}
    </span>
  )
}

export { Label }
