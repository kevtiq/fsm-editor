import Canvas from 'components/canvas/Canvas';
import { ToastProvider } from 'components/Toast';
import { createContext, useEffect, useRef, useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import packageJson from '../package.json';
import Sidebar from 'components/sidebar/Sidebar';
import useTheme from 'hooks/useTheme';
import Controls from 'components/controls/Controls';
import Header from 'components/header/Header';

const initial = JSON.parse(localStorage.getItem('elements')) || [];

export const AppContext = createContext();

export default function App({ children }) {
  const theme = useTheme();
  const [instance, setInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [elements, setElements] = useState(initial);

  function updateElement(field, id) {
    return function (value) {
      setElements((es) =>
        es.map((e) => {
          if (e.id !== id) return e;
          e.data[field] = value.target.value;

          return e;
        })
      );
    };
  }

  useEffect(() => {
    if (!instance) return;
    localStorage.setItem(
      'elements',
      JSON.stringify(instance.toObject().elements)
    );
  }, [elements, instance]);

  return (
    <div className="grail" data-theme={theme}>
      <AppContext.Provider value={{ updateElement, instance, setElements }}>
        <ToastProvider>
          <ReactFlowProvider>
            <Header />
            <main className="reactflow-wrapper" ref={reactFlowWrapper}>
              <Canvas
                wrapper={reactFlowWrapper}
                elements={elements}
                setElements={setElements}
                onLoad={setInstance}
                instance={instance}
              />
              <Controls />
            </main>
            <Sidebar />
            <footer className="text-theme-front">
              <span>{`v${packageJson.version} by `}</span>
              <a href="https://crinkles.io">crinkles</a>
            </footer>
          </ReactFlowProvider>
        </ToastProvider>
      </AppContext.Provider>
    </div>
  );
}
