import React, { useState } from 'react'

import './App.css'

import { RiEditCircleFill } from 'react-icons/ri'

import { Button } from './Components/Button'
import { MessageTemplateEditor } from './Components/MessageTemplateEditor'
import { Modal } from './Components/Modal'
import templateSource from './Modules/MessageTemplateEditor/fixtures/template.json'

function App() {
  const [values, setValues] = useState({
    firstname: 'Bill',
    lastname: 'Gates',
    company: 'Bill & Melinda Gates Foundation',
    position: 'Co-chair',
  } as Record<string, string>)

  const callbackSave = async (template: string) => {
    console.log(template)
  }

  return (
    <div className='App'>
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
              template={JSON.stringify(templateSource)}
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
