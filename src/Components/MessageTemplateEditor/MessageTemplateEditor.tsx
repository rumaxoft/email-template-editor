import React, { useEffect, useMemo, useState } from 'react'
import { RiPresentationFill, RiSave3Line, RiCloseCircleLine } from 'react-icons/ri'

import styles from './MessageTemplateEditor.module.css'

import { TemplateMessageBuilder } from '../../Modules/MessageTemplateEditor/TemplateMessageBuilder'

import { Button } from '../Button'
import { IfThenElseFC } from '../IfThenElse'
import { Label } from '../Label'
import { Loading } from '../Loading'
import { MessagePreview } from '../MessagePreview'
import { TextValue } from '../TextValue'

export interface MessageTemplateEditorProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  template?: string
  values: Record<string, string>
  setValues: (values: Record<string, string>) => void
  callbackSave: (template: string) => Promise<true | null>
  closeModal?: () => void
}

const MessageTemplateEditor: React.FC<MessageTemplateEditorProps> = ({
  children,
  style,
  template = '',
  values,
  callbackSave,
  closeModal,
}) => {
  const tmb = useMemo(() => new TemplateMessageBuilder(template), [template])

  const [astValue, setAstValue] = useState(tmb.getTemplateAst())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTextValueId, setActiveTextValueId] = useState(-1)
  const [innerValues, setValues] = useState(values)
  const [saving, setSaving] = useState(false)

  const setValue = (value: string, id: number) => {
    tmb.updateTextValue(value, id)
    setAstValue(tmb.getTemplateAst())
  }

  const addValue = (value: string, index: number, id: number): void => {
    const currentValue = tmb.getTextValue(id)
    if (currentValue !== null) {
      const leftPart = currentValue.slice(0, index) + value
      const newValue = leftPart + currentValue.slice(index)
      tmb.updateTextValue(newValue, id)
      setCurrentIndex(leftPart.length)
      setAstValue(tmb.getTemplateAst())
    }
  }

  const deleteIfThenElse = (id: number): void => {
    tmb.removeIfThenElse(id)
    setAstValue(tmb.getTemplateAst())
  }

  const addIfThenElse = (id: number, cursorIndex: number): void => {
    tmb.addIfThenElse(id, currentIndex)
    setAstValue(tmb.getTemplateAst())
  }

  const saveTemplate = async () => {
    setSaving(true)
    const result = await callbackSave(tmb.generateTemplate())
    if (result) {
      console.log('saved successfully')
    } else {
      console.log('something went wrong')
    }
    setSaving(false)
  }

  useEffect(() => {
    setCurrentIndex(0)
    const firstTextValueId = tmb.getFirstTextValueId()
    if (firstTextValueId != null) {
      setActiveTextValueId(firstTextValueId)
    }
  }, [setCurrentIndex, setActiveTextValueId, tmb])

  return (
    <div style={style} className={`${styles.MessageTemplateEditor}`}>
      <div className={`${styles.buttonsWrapper}`}>
        <div className={`${styles.varButtons}`}>
          <div>add value:</div>
          {Object.keys(innerValues).map((key) => (
            <Button
              key={key}
              onClick={() => {
                addValue(`{${key}}`, currentIndex, activeTextValueId)
              }}
              xs
              level='neutral'
            >
              {key}
            </Button>
          ))}
        </div>
        <div>
          <div style={{ paddingBottom: '1rem' }}>
            Click to add:{' '}
            <Label level='neutral' xs>
              If
            </Label>
            <span>{' [{some_variable} or expression] '}</span>
            <Label xs>Then</Label>
            <span>{' {then_value} '}</span>
            <Label xs>Else</Label>
            <span>{' {else_value} '}</span>
          </div>
          <Button
            onClick={() => {
              addIfThenElse(activeTextValueId, currentIndex)
            }}
            sm
            level='neutral'
          >
            add If-Then-Else
          </Button>
        </div>
      </div>
      <div className={`${styles.editorWrapper}`}>
        {astValue.value.map((el, index) => {
          if (el.type === 'textValue') {
            return (
              <TextValue
                id={typeof el.id !== 'undefined' ? el.id : -1}
                key={el.id}
                setCurrentIndex={setCurrentIndex}
                setActiveTextValueId={setActiveTextValueId}
                values={innerValues}
                resizable
                value={el.value}
                activeTextValueId={activeTextValueId}
                currentIndex={currentIndex}
                setTextValue={setValue}
              />
            )
          } else if (el.type === 'ifThenElse') {
            return (
              <IfThenElseFC
                id={typeof el.id !== 'undefined' ? el.id : -1}
                key={typeof el.id !== 'undefined' ? el.id : -1}
                setCurrentIndex={setCurrentIndex}
                setActiveTextValueId={setActiveTextValueId}
                values={innerValues}
                value={el}
                activeTextValueId={activeTextValueId}
                currentIndex={currentIndex}
                setTextValue={setValue}
                deleteIfThenElse={deleteIfThenElse}
              />
            )
          } else {
            return null
          }
        })}
      </div>
      <div className={`${styles.footerWrapper}`}>
        <MessagePreview
          buttonContent={
            <Button>
              <RiPresentationFill />
              preview
            </Button>
          }
          template={tmb.generateTemplate()}
          values={innerValues}
          setValues={setValues}
        />
        <Button onClick={saveTemplate} level='neutral'>
          {saving ? <Loading /> : <RiSave3Line />}
          save
        </Button>
        <Button onClick={() => closeModal && closeModal()} level='error'>
          <RiCloseCircleLine />
          close
        </Button>
      </div>
    </div>
  )
}

export { MessageTemplateEditor }
