import styles from './IfThenElse.module.css'

import { IfThenElse } from '../../shared/Template'
import { TextValue } from '../TextValue'

export interface IfThenElseProps {
  id: number
  key: number
  value: IfThenElse
  setTextValue: (value: string, id: number) => void
  values?: Record<string, string>
  activeTextValueId: number
  currentIndex: number
  setCurrentIndex: (value: number) => void
  setActiveTextValueId: (value: number) => void
}

const IfThenElseFC: React.FC<IfThenElseProps> = ({
  value,
  setTextValue,
  values,
  activeTextValueId,
  currentIndex,
  setActiveTextValueId,
  setCurrentIndex,
}) => {
  const [ifNode, thenNode, elseNode] = value.value
  return (
    <div className={`${styles.ifThenElseContainer}`}>
      <div className={`${styles.ifContainer}`}>
        <TextValue
          id={ifNode.id || -1}
          key={ifNode.id}
          activeTextValueId={activeTextValueId}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          setActiveTextValueId={setActiveTextValueId}
          values={values}
          resizable
          value={ifNode.value}
          setTextValue={setTextValue}
        ></TextValue>
      </div>
      <div className={`${styles.thenContainer}`}>
        {thenNode.value.map((el) => {
          if (el.type === 'textValue') {
            return (
              <TextValue
                id={el.id || -1}
                key={el.id}
                activeTextValueId={activeTextValueId}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                setActiveTextValueId={setActiveTextValueId}
                values={values}
                resizable
                value={el.value}
                setTextValue={setTextValue}
              />
            )
          } else if (el.type === 'ifThenElse') {
            return (
              <IfThenElseFC
                id={el.id !== undefined ? el.id : -1}
                key={el.id !== undefined ? el.id : -1}
                activeTextValueId={activeTextValueId}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                setActiveTextValueId={setActiveTextValueId}
                values={values}
                value={el}
                setTextValue={setTextValue}
              />
            )
          } else {
            return null
          }
        })}
      </div>
      <div className={`${styles.elseContainer}`}>
        {elseNode.value.map((el) => {
          if (el.type === 'textValue') {
            return (
              <TextValue
                id={el.id || -1}
                key={el.id}
                activeTextValueId={activeTextValueId}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                setActiveTextValueId={setActiveTextValueId}
                values={values}
                resizable
                value={el.value}
                setTextValue={setTextValue}
              />
            )
          } else if (el.type === 'ifThenElse') {
            return (
              <IfThenElseFC
                id={el.id !== undefined ? el.id : -1}
                key={el.id !== undefined ? el.id : -1}
                activeTextValueId={activeTextValueId}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                setActiveTextValueId={setActiveTextValueId}
                values={values}
                value={el}
                setTextValue={setTextValue}
              />
            )
          } else {
            return null
          }
        })}
      </div>
    </div>
  )
}

export { IfThenElseFC }
