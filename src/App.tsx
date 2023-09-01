import React, { useEffect, useState } from 'react'

import './App.css'

import { RiEditCircleFill } from 'react-icons/ri'

import styles from './App.module.css'
import { Button } from './Components/Button'
import { Loading } from './Components/Loading'
import { MessageTemplateEditor } from './Components/MessageTemplateEditor'
import { Modal } from './Components/Modal'
import templateSource from './Modules/MessageTemplateEditor/fixtures/template.json'
import templateRepository from './repository'

const defaultArrVarNames = ['firstname', 'lastname', 'company', 'position']

function App() {
  const testValues = {
    firstname: 'Bill',
    lastname: 'Gates',
    company: 'Bill & Melinda Gates Foundation',
    position: 'Co-chair',
  }

  const [values, setValues] = useState({} as Record<string, string>)
  const [template, setTemplate] = useState('')
  const [loading, setLoading] = useState(true)

  const callbackSave = async (template: string) => {
    return templateRepository.setTemplate(template)
  }

  useEffect(() => {
    const fetchData = async () => {
      const arrVarNames = await templateRepository.getArrVarNames()
      if (arrVarNames) {
        setValues(arrVarNames.reduce((acc, val) => ({ ...acc, [val]: '' }), {}))
      } else {
        setValues(defaultArrVarNames.reduce((acc, val) => ({ ...acc, [val]: '' }), {}))
      }
      const template = await templateRepository.getTemplate()
      if (template) {
        setTemplate(template)
      }
      // waiting test loading effect
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className='App'>
      {loading && (
        <div className={`${styles.loading}`}>
          <Loading lg />
        </div>
      )}
      <Modal
        buttonContent={
          <Button lg level='primary'>
            <RiEditCircleFill />
            Message Editor with test data
          </Button>
        }
        headerContent={
          <h2 style={{ paddingTop: '2rem', textAlign: 'center', fontSize: '2rem' }}>
            Message Template Editor with test data
          </h2>
        }
        renderChildren={(closeModal) => (
          <div style={{ width: '60vw', height: '70vh', overflow: 'auto', paddingLeft: '4rem', paddingRight: '4rem' }}>
            <MessageTemplateEditor
              template={JSON.stringify(templateSource)}
              values={testValues}
              setValues={setValues}
              callbackSave={callbackSave}
              closeModal={closeModal}
            />
          </div>
        )}
      ></Modal>
      <Modal
        buttonContent={
          <Button lg level='primary'>
            <RiEditCircleFill />
            Message Editor
          </Button>
        }
        headerContent={
          <h2 style={{ paddingTop: '2rem', textAlign: 'center', fontSize: '2rem' }}>Message Template Editor</h2>
        }
        renderChildren={(closeModal) => (
          <div style={{ width: '60vw', height: '70vh', overflow: 'auto', paddingLeft: '4rem', paddingRight: '4rem' }}>
            <MessageTemplateEditor
              template={template}
              values={values}
              setValues={setValues}
              callbackSave={callbackSave}
              closeModal={closeModal}
            />
          </div>
        )}
      ></Modal>
    </div>
  )
}

export default App
