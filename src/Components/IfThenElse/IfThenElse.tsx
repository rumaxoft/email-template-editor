import { RiDeleteBin2Line } from 'react-icons/ri'

import styles from './IfThenElse.module.css'

import { IfThenElse } from '../../shared/Template'

import { Button } from '../Button'
import { Collapse } from '../Collapse'
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
  const thenElse = () => {
    return (
      <>
        <div className={`${styles.ifThenElseContainer}`}>
          <div className={`${styles.label}`}>
            <Button xs>then</Button>
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
        </div>
        <div className={`${styles.ifThenElseContainer}`}>
          <div className={`${styles.label}`}>
            <Button xs>else</Button>
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
      </>
    )
  }
  return (
    <Collapse style={{ marginTop: '0.5rem' }} content={thenElse()}>
      <div className={`${styles.ifThenElseContainer}`}>
        <div className={`${styles.label}`}>
          <Button level='error' style={{ marginRight: 'auto' }} xs>
            <RiDeleteBin2Line />
          </Button>
          <Button level='neutral' xs>
            if
          </Button>
        </div>
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
      </div>
    </Collapse>
  )
}

export { IfThenElseFC }
