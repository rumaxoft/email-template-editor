import styles from './Input.module.css'
export interface InputProps {
  style?: React.CSSProperties
  placeholder?: string
  value: string
  setValue: (value: string) => void
  id?: string
  label?: string
}

const Input: React.FC<InputProps> = ({ placeholder, id, label, value, setValue, style, ...rest }) => {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value)
  }
  return (
    <div className={`${styles.wrapper}`}>
      <input
        style={style}
        className={`${styles.input} ${label && styles.inputLabeled}`}
        id={id}
        onInput={(e) => {
          handleInput(e)
        }}
        placeholder={placeholder}
        value={value}
        {...rest}
      />
      {label && (
        <label className={`${styles.inputLabel}`} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  )
}

export { Input }
