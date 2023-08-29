import React, { useMemo } from 'react'
import { RiCloseCircleLine } from 'react-icons/ri'

import styles from './MessagePreview.module.css'

import { throttle } from '../../helpers/throttle'
import { TemplateMessageBuilder } from '../../Modules/MessageTemplateEditor/TemplateMessageBuilder'

import { Button } from '../Button'
import { Input } from '../Input'
import { Modal } from '../Modal'

export interface MessagePreviewProps {
  style?: React.CSSProperties
  template: string
  values: Record<string, string>
  setValues: (values: Record<string, string>) => void
  buttonContent?: React.ReactElement
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ template = '', values, setValues, buttonContent }) => {
  const throttledGenerateMessageText = throttle(TemplateMessageBuilder.generateMessageText, 30)
  const message = useMemo(
    () => throttledGenerateMessageText(template, values),
    [template, values, throttledGenerateMessageText],
  )

  return (
    <Modal
      buttonContent={buttonContent}
      headerContent={<h2 style={{ paddingTop: '2rem', textAlign: 'center', fontSize: '2rem' }}>Message Preview</h2>}
      renderChildren={(setShowModal) => (
        <div style={{ width: '60vw', height: '70vh', overflow: 'auto', paddingLeft: '4rem', paddingRight: '4rem' }}>
          <div className={`${styles.messagePreview}`}>
            <div className={`${styles.message}`}>{message}</div>
            <div className={`${styles.buttonsWrapper}`}>
              <div>values:</div>
              {Object.keys(values).map((key) => (
                <Input
                  key={key}
                  placeholder={key}
                  label={key}
                  id={key}
                  value={values[key]}
                  setValue={(value) => {
                    setValues({ ...values, [key]: value })
                  }}
                />
              ))}
            </div>
            <div className={`${styles.footerWrapper}`}>
              <Button onClick={() => setShowModal && setShowModal(false)} level='error'>
                <RiCloseCircleLine />
                close
              </Button>
            </div>
          </div>
        </div>
      )}
    ></Modal>
  )
}

export { MessagePreview }
