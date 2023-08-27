import './IfThenElse.css'
import { useEffect, useRef } from 'react'
import { RiDeleteBin2Line } from 'react-icons/ri'

import styles from './IfThenElse.module.css'

import { IfThenElse } from '../../shared/Template'

import { Button } from '../Button'
import { Collapse } from '../Collapse'
import { Label } from '../Label'
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
  deleteIfThenElse: (id: number) => void
}

const IfThenElseFC: React.FC<IfThenElseProps> = ({
  value,
  setTextValue,
  values,
  activeTextValueId,
  currentIndex,
  setActiveTextValueId,
  setCurrentIndex,
  deleteIfThenElse,
  id,
}) => {
  const [ifNode, thenNode, elseNode] = value.value
  const wrapper = useRef<null | HTMLDivElement>(null)
  const ifThenelse = useRef<null | HTMLDivElement>(null)

  const deleteHandler = (id: number): void => {
    if (ifThenelse.current && wrapper.current) {
      ifThenelse.current.classList.add('ifThenElse--remove')
      setTimeout(() => {
        if (wrapper.current) {
          wrapper.current.classList.add('ifThenElse__wrapper--remove')
        }
      }, 200)
      setTimeout(() => {
        deleteIfThenElse(id)
      }, 500)
    }
  }

  useEffect(() => {
    if (wrapper.current) {
      wrapper.current.classList.remove('ifThenElse__wrapper--remove')
    }
    setTimeout(() => {
      if (ifThenelse.current) {
        ifThenelse.current.classList.remove('ifThenElse--remove')
      }
    }, 200)
  }, [])

  const thenElse = () => {
    return (
      <>
        <div className={`${styles.ifThenElseContainer}`}>
          <div className={`${styles.label}`}>
            <Label xs>then</Label>
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
                    deleteIfThenElse={deleteIfThenElse}
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
            <Label xs>else</Label>
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
                    deleteIfThenElse={deleteIfThenElse}
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
    <div ref={wrapper} className={`ifThenElse__wrapper ifThenElse__wrapper--remove`}>
      <div ref={ifThenelse} className={`ifThenElse ifThenElse--remove`}>
        <Collapse content={thenElse()}>
          <div className={`${styles.ifThenElseContainer}`}>
            <div className={`${styles.label}`}>
              <Button onClick={(e) => deleteHandler(id)} level='error' style={{ marginRight: 'auto' }} xs>
                <RiDeleteBin2Line />
              </Button>
              <Label level='neutral' xs>
                if
              </Label>
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
      </div>
    </div>
  )
}

export { IfThenElseFC }
