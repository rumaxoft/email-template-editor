import styles from './Loading.module.css'
export interface LoadingProps {
  lg?: boolean
  sm?: boolean
}

const Loading: React.FC<LoadingProps> = ({ lg, sm }) => {
  return (
    <span
      className={`${styles.loading} 
    ${lg ? styles.lg : ''}
    ${sm ? styles.sm : ''}
    `}
    ></span>
  )
}

export { Loading }
