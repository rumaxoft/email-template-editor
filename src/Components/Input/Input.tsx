import styles from './Input.module.css'
export interface InputProps {
  style?: React.CSSProperties
  placeholder?: string
  value: string
  setValue: (value: string) => void
}

const Input: React.FC<InputProps> = ({ placeholder, value, setValue, style, ...rest }) => {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }
  return (
    <input
      style={style}
      className={`${styles.input} 
    `}
      onInput={(e) => {
        handleInput(e)
      }}
      placeholder={placeholder}
      value={value}
      {...rest}
    />
  )
}

export { Input }
